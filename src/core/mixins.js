// 混入
import { Message } from 'element-ui';
import { mapActions, mapState } from 'vuex'
import appConfig from '@/config/app';
import { SignLogout } from '@/api/sign';
import * as appUtil from '@/utils/app';
import store from '@/store'
import { hasPermission, setUserAuthResource } from '@/utils/auth';

const mapStateEnums = {
}

Object.keys(store.state.enumStore.enums).forEach((key) => {
  mapStateEnums[key] = state => state.enumStore.enums[key]
})


export default {
  data() {
    return {
      appConfig,
      user: appUtil.getUser(), // 已登录用户
      isMounted: false,
    };
  },
  computed: {
    ...mapState({
      ...mapStateEnums,
    }),
  },
  methods: {
    ...mapActions({
      fetchEnums_Raw: 'fetchEnums',
    }),

    async fetchEnums(...enums) {
      return await this.fetchEnums_Raw(enums)
    },


    // 校验是否具有权限
    hasPermission,

    // 回到主页
    handleToHome() {
      if (this.$route.name === 'home') return;
      this.$router.push('/');
    },

    // 退出登录
    async handleLogout() {
      try {
        await this.$confirm('确定退出当前登录？', '操作提示', {
          type: 'warning'
        });

        // 调用接口通知后端退出
        try {
          SignLogout();
        } catch (error) {
          console.error(error);
        }

        // 清除 mixins 中的 user 变量
        this.user = null;

        // 更新状态
        this.$store.dispatch('removeUserByAction');

        // 清空动态路由
        setUserAuthResource('');

        // 清除缓存
        appUtil.clearCache();

        this.msg({
          type: 'success',
          content: '已退出登录'
        });

        // 转到主页
        window.location = '/login';
      } catch (error) {
        if (error === 'cancel') return;
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    /**
     * 消息提示封装
     * @description `options` 为通用配置，适合大部分场景，`defaults` 为详细配置，参考对应 mode 的配置项
     * @param {Object} options 通用配置
     * @param {Object} defaults mode 对应的细节配置
     */
    async msg(options = {}, defaults = {}) {
      const _options = {
        mode: 'message', // 消息类型，message | alert | confirm | notification
        type: 'info', // 消息类型，success | warning | info | error
        content: '', // 消息内容
        title: null, // 标题内容
        duration: 1000 * 3, // 显示停留时间，毫秒
        offset: 20, // Message 消息距离窗口顶部偏移
        rich: false, // 是否把内容作为 HTML 展示
        position: 'top-right', // notification 类型消息的显示位置 top-right | top-left | bottom-right | bottom-left
        ...options
      };

      // 特殊信息需要打印到控制台
      if (['warning', 'error'].includes(_options.type)) {
        switch (_options.type) {
          case 'error':
            console.error(_options.content);
            break;
          case 'warning':
          default:
            console.trace(_options.content);
            break;
        }
      }

      // Alert
      if (_options.mode === 'alert') {
        return this.$alert(_options.content, _options.title, {
          type: _options.type,
          dangerouslyUseHTMLString: _options.rich,
          ...defaults
        });
      }

      // Confirm
      if (_options.mode === 'confirm') {
        return this.$confirm(_options.content, _options.title, {
          type: _options.type,
          dangerouslyUseHTMLString: _options.rich,
          ...defaults
        });
      }

      // Notification 通知
      if (_options.mode === 'notification') {
        return this.$notify({
          type: _options.type,
          title: _options.title,
          message: _options.content,
          duration: _options.duration,
          offset: _options.offset,
          dangerouslyUseHTMLString: _options.rich,
          ...defaults
        });
      }

      // Message 消息提示
      Message.closeAll();
      this.$message({
        type: _options.type,
        message: _options.content,
        dangerouslyUseHTMLString: _options.rich,
        duration: _options.duration,
        offset: _options.offset,
        ...defaults
      });
    }
  },
  mounted() {
    this.isMounted = true;
  }
};
