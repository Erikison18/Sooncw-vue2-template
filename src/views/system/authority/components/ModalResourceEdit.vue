<template>
  <el-dialog
    :visible.sync="modal"
    :title="resource ? '编辑资源' : '新增资源'"
    width="480px"
    append-to-body
  >
    <div class="modal">
      <div v-loading="pending" class="modal-body">
        <el-form class="form" size="small" label-position="top">
          <el-form-item label="权限名称" required>
            <el-input
              v-model="form.title"
              maxlength="64"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="权限标识" :required="!resource">
            <div class="flex">
              <div class="expand">
                <el-input
                  v-model="form.identifier"
                  maxlength="64"
                  placeholder="请输入"
                  :disabled="!!resource"
                  clearable
                />
              </div>
              <el-button
                v-if="!resource"
                class="margin-left"
                type="primary"
                plain
                @click="createUUID"
              >
                创建UUID标识
              </el-button>
            </div>
          </el-form-item>
          <el-form-item label="调用接口" required>
            <el-input
              v-model="form.url"
              maxlength="255"
              placeholder="请输入"
              clearable
            />
            <p class="form-tips">
              直接填写后端提供的接口即可，如：/api/manage/client/menus/resources/{id}
            </p>
          </el-form-item>
          <el-form-item label="请求方式" required>
            <el-radio-group v-model="form.method">
              <el-radio
                v-for="(method, index) in urlRequestMethods"
                :key="index"
                :label="method"
              >
                {{ method }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="说明">
            <el-input
              v-model="form.description"
              maxlength="255"
              placeholder="请输入"
              clearable
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="modal-options" :disabled="pending">
        <el-button size="small" @click="modal = false">
          取消
        </el-button>
        <el-button size="small" type="success" @click="handleSubmit">
          {{ resource ? '保存修改' : '确定' }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

import {
  CreateResourceParams,
  CreateResourceValidate,
  CreateResource,
  UpdateResourceParams,
  UpdateResourceValidate,
  UpdateResource
} from '@/api/system/authority_resources';

// 请求方式预设
const URL_REQUEST_METHODS = [
  'GET',
  'POST',
  'PATCH',
  'PUT',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'TRACE'
];

// 新增或编辑权限资源
export default {
  name: 'ModalResourceEdit',
  props: {
    value: Boolean,

    // 编辑的角色
    menuId: String,

    // 资源详情
    resource: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      modal: this.$props.value,
      pending: false,
      urlRequestMethods: URL_REQUEST_METHODS,
      form: this.$props.menuId
        ? { ...UpdateResourceParams }
        : { ...CreateResourceParams }
    };
  },
  watch: {
    value(value) {
      this.modal = value;
    },
    modal(value) {
      if (value) {
        this.form = this.$props.menuId
          ? { ...UpdateResourceParams }
          : { ...CreateResourceParams };

        this.form.menuId = this.$props.menuId;

        if (this.$props.resource) {
          const { resource } = this.$props;
          Object.keys(UpdateResourceParams).forEach(key => {
            this.form[key] = resource[key];
          });
        }
      } else {
        this.form = {};
      }
      this.$emit('input', value);
    }
  },
  methods: {
    // 创建 UUID 权限标识
    createUUID() {
      this.form.identifier = uuidv4();
    },

    // 提交操作
    async handleSubmit() {
      try {
        const { resource } = this.$props;
        const { form } = this;

        if (resource) {
          await this.msg({
            mode: 'confirm',
            title: '操作提示',
            content: '确定保存当前修改？'
          });
          this.pending = true;
          const _updateForm = await UpdateResourceValidate(form);
          await UpdateResource(resource.id, _updateForm);
        } else {
          this.pending = true;
          const _createForm = await CreateResourceValidate(form);
          await CreateResource(_createForm);
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

<style lang="scss" scoped>
@import '../../../../styles/const.scss';

/deep/.el-radio {
  margin-right: $voidLarge;
  margin-bottom: $void;
  padding: 4px 0;

  .el-radio__label {
    text-align: left;
    padding-left: 2px;
  }
}
</style>
