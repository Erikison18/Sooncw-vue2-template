import { Message } from "element-ui";
import HTTPConfig from "@/http/config";
import * as grant from "@/core/grant";

// 全局混入
// 我们可以把全局混入当做一个"基类"，所有页面和组件可以使用其中的成员属性。
// 这样可以避免我们在页面中重复引用某些定义。
// 当然，某些属性我们也可以放在 ./src/App.vue 里，然后使用 this.$root.* 访问。
export default {
  data() {
    return {
      // 全局配置，全局配置在 ./src/main.js 中引入，请使用 this.$config.* 访问

      // 当前页面的完整路径
      fullPath: this.$route ? this.$route.fullPath : "",

      // 当前页面的路由 Meta
      routerMeta: this.$route ? this.$route.meta : {},

      // 上传地址
      // 参考：https://element.eleme.cn/2.13/#/zh-CN/component/upload#attribute
      uploadAction: HTTPConfig.api + "/upload",
      uploadHeaders: {
        platform: HTTPConfig.auth.platform,
        Authorization: `Bearer ${grant.getAuthToken()}`
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    // 注销登录操作
    // 通常，我们可能可以从多个位置执行退出登录
    async handleLogout() {
      try {
        await this.msg({
          message: "确定退出当前登录账户？",
          mode: "confirm"
        });

        // 清除本地数据
        this.$store.dispatch("removeUser");
        grant.clearAuth();

        // 触发后端接口
        // 略···

        // 打印消息
        this.msg({
          message: "您已退出登录",
          type: "success"
        });

        // 转到登录页
        // this.$router.replace('/');
      } catch (error) {
        if (error === "cancel") return;

        this.msg({
          message: error,
          type: "error"
        });
      }
    },

    /**
     * 弹出消息
     * 官方文档<https://element.eleme.cn/2.13/#/zh-CN/component/message>
     * @description 统一弹出消息
     * @param {Object} options
     */
    msg(options = {}) {
      // 参数继承
      options = {
        ...{
          mode: "message", // 模式，message 浮动消息 | confirm 确认弹窗 | alert 提示消息
          type: "info", // 消息类型 info | success | error | warning
          title: "操作提示", // alert 或 confirm 时展示的标题
          message: "", // 消息
          duration: 1500, // 默认显示 1.5 秒，仅 message 有效
          dangerouslyUseHTMLString: false
        },
        ...options
      };

      if (!options.message) return;

      // 控制台打印
      let consoleType = "log";

      if (options.type === "error") {
        consoleType = "error";
      } else if (options.type === "warning") {
        consoleType = "warn";
      } else {
        consoleType = "log";
      }

      // 只打印 Error 级别的消息
      if (consoleType === "error") {
        console[consoleType](options.message);
      }

      // alert 弹窗
      if (options.mode === "alert") {
        return this.$alert(options.message, options.title, {
          confirmButtonText: "确定",
          ...options
        });
      }

      // confirm 弹窗
      if (options.mode === "confirm") {
        return this.$confirm(options.message, options.title, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          ...options
        });
      }

      // 弹出消息
      Message.closeAll();
      Message(options);
    }
  }
};
