<template>
  <el-dialog
    :visible.sync="modal"
    title="角色分配"
    width="650px"
    append-to-body
  >
    <div class="modal">
      <div v-loading="pending" class="modal-body">
        <el-transfer
          v-model="checked"
          :data="roles"
          :titles="['所有角色', '已选角色']"
          filterable
        >
          <div
            slot="left-footer"
            class="flex main-end cros-center"
            style="height: 100%; padding: 0 4px;"
          >
            <el-button size="mini" type="primary" plain @click="handleCheckAll">
              全选
            </el-button>
          </div>
          <div
            slot="right-footer"
            class="flex main-end cros-center"
            style="height: 100%; padding: 0 4px;"
          >
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleClearChecked"
            >
              清除全部
            </el-button>
          </div>
        </el-transfer>
      </div>
      <div class="modal-options" :disabled="pending">
        <el-button size="small" @click="modal = false">
          取消
        </el-button>
        <el-button size="small" type="success" @click="handleSubmit">
          保存修改
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { GetRolesOfClient } from '@/api/system/roles';
import { GetOperatorRoles, SetOperatorRoles } from '@/api/system/operator';

// 操作员角色分配
export default {
  name: 'ModalRoleEdit',
  props: {
    value: Boolean,

    // 客户端ID
    clientId: {
      type: String,
      require: true
    },

    // 可以继续在这里添加额外的 prop
    operator: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      modal: this.$props.value,
      pending: false,
      roles: [],
      checked: []
    };
  },
  watch: {
    value(value) {
      this.modal = value;
    },
    modal(value) {
      if (value) {
        this.init();
      } else {
        this.roles = [];
        this.checked = [];
      }
      this.$emit('input', value);
    }
  },
  methods: {
    // 初始化
    async init() {
      try {
        const { clientId, operator } = this.$props;

        // 初始化当前客户端的所有角色
        const _roles = await GetRolesOfClient(clientId);
        this.roles = _roles.map(row => {
          return {
            key: row.roleId,
            label: row.title,
            _source: row
          };
        });

        // 获取当前用户已关联的角色
        this.checked = await GetOperatorRoles(clientId, operator.userId);
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 全选角色
    handleCheckAll() {
      this.checked = [...this.roles].map(row => row.key);
    },

    // 清除所选
    handleClearChecked() {
      this.checked = [];
    },

    // 提交操作
    async handleSubmit() {
      try {
        const { clientId, operator } = this.$props;
        const { checked } = this;

        await this.msg({
          mode: 'confirm',
          title: '操作提示',
          content: '确定保存当前修改？'
        });

        this.pending = true;

        // 执行接口操作
        await SetOperatorRoles(clientId, operator.userId, checked);

        this.msg({
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

  &__buttons {
    flex: 1;
  }
}
</style>
