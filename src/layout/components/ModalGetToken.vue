<template>
  <el-dialog
    :visible.sync="modal"
    title="信息获取"
    width="560px"
    append-to-body
  >
    <div class="modal">
      <div v-loading="pending" class="modal-body">
        <el-form
          class="form"
          size="small"
          label-position="left"
          label-width="80px"
          style="padding-right: 60px;"
        >
          <el-form-item label="登录帐号">
            <el-input
              v-model="account"
              placeholder="请输入"
              maxlength="16"
              clearable
            />
          </el-form-item>
          <el-form-item label="客户端">
            <el-select
              v-model="clientId"
              placeholder="请选择"
              style="width: 100%;"
              clearable
            >
              <el-option
                v-for="(client, inndex) in clients"
                :key="inndex"
                :label="client.name"
                :value="client.clientId"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="info" label="信息">
            <div class="flex cros-center">
              <div
                class="expand color-info"
                style="font-weight: bold; font-size: 12px;"
              >
                {{ info }}
              </div>
              <el-button
                class="margin-left"
                size="mini"
                plain
                v-clipboard="info"
                @success="handleCopySuccess"
                @error="handleCopyError"
                >复制</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="modal-options">
        <el-button size="small" :disabled="pending" @click="modal = false">
          取消
        </el-button>
        <el-button
          size="small"
          type="success"
          :disabled="pending"
          @click="handleSubmit"
        >
          确认
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
import VueClipboards from 'vue-clipboards';
Vue.use(VueClipboards);

import { GetClients, GetClientAccount } from '@/api/system/clients';
import { trimValue } from '@/utils/tools';
import { hasPermission } from '@/utils/auth';

export default {
  name: 'ModalGetToken',
  props: {
    value: Boolean
  },
  data() {
    return {
      modal: this.$props.value,
      pending: false,
      clients: [],
      account: null,
      clientId: null,
      info: null
    };
  },
  watch: {
    value(value) {
      this.modal = value;
    },

    modal(value) {
      if (!value) {
        this.account = null;
        this.clientId = null;
        this.info = null;
      }
      this.$emit('input', value);
    },

    account(value) {
      if (value) return;
      this.info = null;
    },

    clientId(value) {
      if (value) return;
      this.info = null;
    }
  },
  methods: {
    // 初始化
    async init() {
      try {
        // 初始化客户端列表
        this.clients = await GetClients();
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    async handleSubmit() {
      try {
        if (!hasPermission('d5bc2787-7bbc-421b-a271-52fb8ad89b6d', 'FUNCTION'))
          throw '没有权限执行该操作';
        const { account, clientId } = this;

        let _account = trimValue(account);
        if (!_account) throw '请填写登录账号';
        if (!clientId) throw '请虚选择一个客户端';

        this.pending = true;

        this.info = await GetClientAccount(_account, clientId);
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.pending = false;
      }
    },

    handleCopySuccess() {
      this.msg({
        type: 'success',
        content: '复制成功'
      });
    },

    handleCopyError() {
      this.msg({
        type: 'error',
        content: '复制失败，请手动选择复制'
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
