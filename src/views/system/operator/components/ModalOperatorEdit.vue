<template>
  <el-dialog
    :visible.sync="modal"
    :title="operator ? '编辑操作员' : '新增操作员'"
    width="710px"
    append-to-body
  >
    <div class="modal">
      <div v-loading="pending" class="modal-body">
        <el-form class="form" size="small" label-position="top">
          <el-form-item label="登录帐号" :required="!operator">
            <el-input
              v-model="form.username"
              maxlength="16"
              placeholder="请输入"
              :disabled="!!operator"
              clearable
            />
          </el-form-item>
          <el-form-item label="操作员名称" required>
            <el-input
              v-model="form.nickName"
              maxlength="16"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item v-if="!operator" label="登录密码" required>
            <el-input
              v-model="form.password"
              type="password"
              maxlength="32"
              placeholder="请输入"
              auto-complete="new-password"
              show-password
              clearable
            />
          </el-form-item>
          <el-form-item label="手机号码" required>
            <el-input
              v-model="form.mobile"
              maxlength="11"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="门店权限">
            <OperatorStore v-model="storesChecked" :stores="stores" />
          </el-form-item>
        </el-form>
      </div>
      <div class="modal-options" :disabled="pending">
        <el-button size="small" @click="modal = false">
          取消
        </el-button>
        <el-button size="small" type="success" @click="handleSubmit">
          {{ operator ? '保存修改' : '确定' }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  CreateOperatorParams,
  CreateOperatorValidate,
  CreateOperator,
  UpdateOperatorParams,
  UpdateOperatorValidate,
  UpdateOperator,
  GetStores,
  GetOperatorStores,
  SetOperatorStores
} from '@/api/system/operator';

// 新增或编辑操作员
export default {
  name: 'ModalOperatorEdit',
  components: {
    OperatorStore: () => import('./OperatorStore')
  },
  props: {
    value: Boolean,

    // 客户端ID，仅新增操作员时有效
    clientId: String,

    // 编辑的操作员
    operator: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      modal: this.$props.value,
      pending: false,
      form: this.$props.operator
        ? { ...UpdateOperatorParams }
        : { ...CreateOperatorParams },
      stores: [],
      storesChecked: []
    };
  },
  watch: {
    value(value) {
      this.modal = value;
    },
    modal(value) {
      if (value) {
        this.init();
        if (this.$props.operator) {
          this.form = { ...UpdateOperatorParams, ...this.$props.operator };
        } else {
          this.form = { ...CreateOperatorParams };
          // 初始化客户端
          const { clientId } = this.$props;
          if (clientId) {
            this.form.client = clientId;
          }
        }
      } else {
        this.form = { ...CreateOperatorParams };
        this.storesChecked.splice(0);
      }
      this.$emit('input', value);
    }
  },
  methods: {
    // 初始化
    async init() {
      try {
        this.pending = true;

        // 获取全部门店
        const _stores = await GetStores();
        this.stores = _stores.map(row => {
          return {
            key: row.storeNo,
            label: row.storeName,
            source: row
          };
        });

        // 获取当前用户已配置的门店
        const { operator } = this.$props;
        if (operator) {
          const _checked = await GetOperatorStores(operator.userId);
          this.storesChecked = _checked.map(row => row.storeNo);
        }
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.pending = false;
      }
    },

    // 在这里添加方法
    async fetchDetail() {
      this.detail = {
        username: 'vue',
        email: 'vue@vue.io'
      };
    },

    // 提交操作
    async handleSubmit() {
      try {
        const { form, storesChecked } = this;
        const { operator } = this.$props;

        if (operator) {
          await UpdateOperatorValidate(form);

          await this.msg({
            mode: 'confirm',
            title: '操作提示',
            content: '确定保存当前修改？'
          });

          this.pending = true;

          await UpdateOperator(operator.id, form);
          await SetOperatorStores(operator.userId, storesChecked);
        } else {
          await CreateOperatorValidate(form);
          this.pending = true;
          const _operator = await CreateOperator(form);
          await SetOperatorStores(_operator.userId, storesChecked);
        }

        // 更新门店信息
        await this.msg({
          type: 'success',
          content: '操作成功'
        });

        this.modal = false;
        this.$emit('on-success');
      } catch (error) {
        if (error === 'cancel') return;
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.pending = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-transfer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
