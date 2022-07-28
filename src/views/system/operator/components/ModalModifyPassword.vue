<template>
  <el-dialog
    :visible.sync="modal"
    title="修改密码"
    width="480px"
    append-to-body
  >
    <div class="modal">
      <div v-loading="pending" class="modal-body">
        <el-form class="form" size="small" label-position="top">
          <el-form-item label="新密码" required>
            <el-input
              v-model="form.password"
              type="password"
              maxlength="32"
              placeholder="请输入"
              show-password
              clearable
            />
          </el-form-item>
          <el-form-item label="确认密码" required>
            <el-input
              v-model="passwordConfirm"
              type="password"
              maxlength="32"
              placeholder="请输入"
              show-password
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="modal-options" :disabled="pending">
        <el-button size="small" @click="modal = false">
          取消
        </el-button>
        <el-button size="small" type="success" @click="handleSubmit">
          确认
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { UpdateOperatorParams, UpdateOperator } from '@/api/system/operator';

// 修改密码
export default {
  name: 'ModalModifyPassword',
  props: {
    value: Boolean,

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
      form: { ...UpdateOperatorParams },
      passwordConfirm: null
    };
  },
  watch: {
    value(value) {
      this.modal = value;
    },
    modal(value) {
      if (value) {
        if (this.$props.operator) {
          this.form = { ...UpdateOperatorParams, ...this.$props.operator };
        }
      } else {
        this.form = { ...UpdateOperatorParams };
        this.passwordConfirm = null;
      }
      this.$emit('input', value);
    }
  },
  methods: {
    // 提交操作
    async handleSubmit() {
      try {
        const { form, passwordConfirm } = this;
        const { operator } = this.$props;

        if (!form.password) throw '请填写新密码';
        if (/\s/.test(form.password)) throw '密码格式错误，请重新填写';
        if (!passwordConfirm) throw '请再次输入密码确认';
        if (form.password !== passwordConfirm)
          throw '两次密码输入不一致，请检查';

        this.pending = true;

        // 执行接口操作
        await UpdateOperator(operator.id, form);

        this.modal = false;
        this.$emit('on-success');
      } catch (error) {
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
