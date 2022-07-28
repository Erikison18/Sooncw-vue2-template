<template>
  <div class="login-wrap">
    <div class="container">
      <div class="cover"></div>
      <div class="form-box">
        <div class="logo">
          <em></em>
          <span>{{ appConfig.title }}</span>
        </div>
        <el-form v-loading="pending" v-model="form" class="form" size="small">
          <el-form-item>
            <el-input
              v-model="form.username"
              prefix-icon="kd-icon kd-icon-pserson"
              placeholder="账号"
              maxlength="32"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.password"
              prefix-icon="kd-icon kd-icon-key"
              type="password"
              placeholder="密码"
              maxlength="32"
            />
          </el-form-item>
          <el-form-item>
            <div class="verify-code">
              <el-input
                v-model="form.captcha"
                prefix-icon="kd-icon kd-icon-risk"
                placeholder="验证码"
                maxlength="5"
              />
              <div class="image">
                <img
                  :src="captchaImage"
                  alt="验证码"
                  @click="generateCaptcha"
                />
              </div>
              <div class="refresh">
                <el-tooltip
                  effect="dark"
                  content="看不清？换一个"
                  placement="top"
                >
                  <i class="kd-icon kd-icon-refresh" @click="generateCaptcha" />
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="flex main-center actions">
              <div class="reset-password">
                忘记密码？<span>请联系管理员</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="submit" type="primary" @click="handleSubmit">
              登&nbsp;&nbsp;录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="copyright">
          <p>Copyright &copy; 2021 快度物联科技有限公司 版权所有</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  GetCaptchaImage,
  SignLoginParams,
  SignLogin,
  GetAuthUser,
  GetAuthMenu,
  GetAuthResource
} from '@/api/sign';
import { setToken, setUser } from '@/utils/app';
import { setAuthMenus, setAuthResources } from '@/utils/auth';

export default {
  name: 'login',
  data() {
    return {
      pending: false,
      form: {
        ...SignLoginParams,
        // 开发环境提供测试账号，避免新同学无账号信息无法快速介入开发
        username: process.env.NODE_ENV === 'development' ? 'admin' : null,
        password: process.env.NODE_ENV === 'development' ? 'admin123' : null
      },
      autoLogin: false,
      captchaCode: new Date().getTime(),
      captchaImage: null
    };
  },
  methods: {
    // 初始化
    async init() {
      try {
        this.generateCaptcha();
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 生成图片验证码
    async generateCaptcha() {
      const code = Math.ceil(Math.random() * new Date().getTime());
      this.form.captcha_no = code;
      this.captchaImage = GetCaptchaImage(code);
    },

    // 提交登录
    async handleSubmit() {
      try {
        this.pending = true;

        // 提交登录获取登录信息
        const _auth = await SignLogin(this.form);
        setToken(_auth.access_token);

        // 初始化用户信息
        const _user = await GetAuthUser();
        setUser(_user);

        // 获取用户的权限资源，注意，后端返回的菜单数据既包含菜单，也包含操作
        const _authMenus = await GetAuthMenu();
        setAuthMenus(_authMenus);

        const _authResource = await GetAuthResource();
        setAuthResources(_authResource);

        location.href = '/';
      } catch (error) {
        this.generateCaptcha();
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.pending = false;
      }
    },

    // 回车键提交登录表单
    handleEnterKeyLogin(e) {
      if (e.keyCode !== 13) return;
      this.handleSubmit();
    }
  },
  mounted() {
    this.init();
    window.addEventListener('keydown', this.handleEnterKeyLogin, false);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleEnterKeyLogin, false);
  }
};
</script>

<style lang="scss" scped>
@import './style.scss';
</style>
