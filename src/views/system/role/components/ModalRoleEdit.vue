<template>
  <el-dialog
    :visible.sync="modal"
    :title="role ? '编辑角色' : '新增角色'"
    width="680px"
    append-to-body
  >
    <div class="modal">
      <div class="modal-body">
        <el-form
          class="form"
          size="small"
          label-position="top"
          :disabled="pending"
        >
          <el-form-item label="角色名称" required>
            <el-input
              v-model="form.title"
              maxlength="64"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="角色标识" required>
            <el-input
              v-model="form.identifier"
              maxlength="64"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="自定义属性">
            <Extra v-model="form.extra" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="form.description"
              maxlength="255"
              placeholder="请输入"
              clearable
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio label="Y">正常</el-radio>
              <el-radio label="N">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="modal-options" :disabled="pending">
        <el-button size="small" :disabled="pending" @click="modal = false">
          取消
        </el-button>
        <el-button
          size="small"
          type="success"
          :disabled="pending"
          @click="handleSubmit"
        >
          保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  CreateRoleParams,
  CreateRoleValidate,
  CreateRole,
  UpdateRoleParams,
  UpdateRoleValidate,
  UpdateRole,
  GetRoleDetail
} from '@/api/system/roles';

// 新增或编辑角色
export default {
  name: 'ModalRoleEdit',
  components: {
    Extra: () => import('./Extra')
  },
  props: {
    value: Boolean,

    // 客户端标识
    clientId: {
      type: String,
      require: true
    },

    // 编辑的角色
    role: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      modal: this.$props.value,
      pending: false,
      form: { ...CreateRoleParams }
    };
  },
  watch: {
    value(value) {
      this.modal = value;
    },
    modal(value) {
      if (value) {
        const { clientId, role } = this.$props;
        this.form = role
          ? {
              ...UpdateRoleParams
            }
          : {
              ...CreateRoleParams,
              clientId
            };

        if (role) {
          this.fetchDetail();
        }
      } else {
        this.form = {};
      }
      this.$emit('input', value);
    }
  },
  methods: {
    // 获取角色详情
    async fetchDetail() {
      try {
        this.pending = true;
        const { role } = this.$props;
        const _role = await GetRoleDetail(role.id);
        Object.keys(UpdateRoleParams).forEach(key => {
          this.form[key] = _role[key];
        });
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.pending = false;
      }
    },

    // 提交操作
    async handleSubmit() {
      if (this.pending) return;

      try {
        const { role } = this.$props;
        const { form } = this;

        if (role) {
          const _updateForm = await UpdateRoleValidate(form);

          await this.msg({
            mode: 'confirm',
            title: '操作提示',
            content: '确定保存当前修改？'
          });
          this.pending = true;
          await UpdateRole(role.id, _updateForm);
        } else {
          this.pending = true;
          const _createForm = await CreateRoleValidate(form);
          await CreateRole(_createForm);
        }

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
