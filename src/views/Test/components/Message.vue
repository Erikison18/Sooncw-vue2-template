<template>
  <el-card shadow="never">
    <h4 slot="header">全局混合 - <code>this.msg</code></h4>

    <el-divider class="margin-huge-bottom" content-position="left">
      Message 提示消息
    </el-divider>

    <el-button @click="handleMsgBase">
      默认消息
    </el-button>

    <el-button type="success" plain @click="handleMsgSuccess">
      成功
    </el-button>

    <el-button type="danger" plain @click="handleMsgError">
      失败
    </el-button>

    <el-button type="primary" plain @click="handleMsgHtml">
      富文本消息
    </el-button>

    <el-divider class="margin-huge-y" content-position="left">
      Alert 模态弹窗
    </el-divider>

    <el-button @click="handleMsgAlert">
      模态消息
    </el-button>

    <el-button type="success" plain @click="handleMsgAlertSuccess">
      模态消息 成功
    </el-button>

    <el-button type="danger" plain @click="handleMsgAlertError">
      模态消息 失败
    </el-button>

    <el-divider class="margin-huge-y" content-position="left">
      Confirm 确认弹窗
    </el-divider>

    <el-button @click="handleMsgConfirm">
      确认操作
    </el-button>

    <el-button type="success" plain @click="handleMsgConfirmSuccess">
      成功
    </el-button>

    <el-button type="danger" plain @click="handleMsgConfirmError">
      失败
    </el-button>

    <div class="margin-bottom"></div>
  </el-card>
</template>

<script>
export default {
  methods: {
    // 默认消息
    handleMsgBase() {
      this.msg({ message: "这是一条消息" });
    },

    // 成功消息
    handleMsgSuccess() {
      this.msg({ message: "这是一条成功消息", type: "success" });
    },

    // 失败消息
    handleMsgError() {
      this.msg({ message: "这是一条错误消息", type: "error" });
    },

    handleMsgHtml() {
      this.msg({
        message:
          '请确认 <b class="color-red">用户编号：SFDD8000140283</b> 是否正确！',
        dangerouslyUseHTMLString: true
      });
    },

    handleMsgAlert() {
      this.msg({ message: "这是一条 alert 消息", mode: "alert" });
    },

    handleMsgAlertSuccess() {
      this.msg({
        message: "这是一条 alert 消息",
        mode: "alert",
        type: "success"
      });
    },

    handleMsgAlertError() {
      this.msg({
        message: "这是一条 alert 消息",
        mode: "alert",
        type: "error"
      });
    },

    handleMsgConfirm() {
      this.msg({
        message: "这是一条 Confirm 消息",
        mode: "confirm"
      });
    },

    handleMsgConfirmSuccess() {
      this.msg({
        message: "这是一条 Confirm 消息",
        mode: "confirm",
        type: "success"
      });
    },

    handleMsgConfirmError() {
      this.msg({
        message: "这是一条 Confirm 消息",
        mode: "confirm",
        type: "error"
      });
    }
  }
};
</script>
