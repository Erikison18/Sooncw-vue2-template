<template>
  <div :class="['main', sideToggled ? 'side-toggled' : '']">
    <div class="sidebar">
      <!-- LOGO -->
      <div class="brand" :title="appConfig.title" @click="handleToHome">
        <i />
        <span>{{ appConfig.title }}</span>
      </div>
      <!-- 侧边导航 -->
      <div class="nav-wrap">
        <Nav />
      </div>
    </div>
    <div class="content">
      <div class="header">
        <!-- 左侧区域 -->
        <div class="start">
          <!-- 侧边卷展 -->
          <i
            class="kd-icon kd-icon-list icon-side-toggle"
            @click="sideToggled = !sideToggled"
          />
          <!-- 一级菜单图标 -->
          <i :class="[routeTopic.meta.icon, 'icon-refer']" />
          <!-- 页面标题 -->
          <h1 class="title" :title="pageTitle">{{ pageTitle }}</h1>
          <!-- 面包屑 -->
          <div class="breadcrumb-wrap">
            <el-breadcrumb separator="·">
              <el-breadcrumb-item v-if="$route.name !== 'home'" to="/">
                首页
              </el-breadcrumb-item>
              <template v-for="(item, index) in breadcrumbs">
                <el-breadcrumb-item
                  v-if="index < breadcrumbs.length - 1"
                  :to="item.to"
                  :key="index"
                >
                  {{ item.title }}
                </el-breadcrumb-item>
                <el-breadcrumb-item v-else :key="index">
                  {{ item.title }}
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </div>
        <div class="end">
          <!-- 快捷操作 -->
          <div class="options">
            <template
              v-if="
                hasPermission(
                  'd5bc2787-7bbc-421b-a271-52fb8ad89b6d',
                  'FUNCTION'
                )
              "
            >
              <el-tooltip effect="dark" content="信息获取" placement="bottom">
                <div class="handle color-primary" @click="modalGetToken = true">
                  <i class="kd-icon kd-icon-group" />
                </div>
              </el-tooltip>
            </template>
            <el-tooltip
              effect="dark"
              :content="notices.length ? '消息通知' : '暂无通知消息'"
              placement="bottom"
            >
              <div class="handle">
                <el-badge :value="notices.length || 999" is-dot>
                  <i class="kd-icon kd-icon-notice" />
                </el-badge>
              </div>
            </el-tooltip>
          </div>
          <!-- 用户信息 -->
          <el-dropdown
            trigger="click"
            placement="bottom"
            size="small"
            @command="handleMenuCommand"
          >
            <div class="user-base">
              <!-- 用户头像 -->
              <div class="avatar">
                <div class="inner">
                  <i class="kd-icon kd-icon-user" />
                </div>
              </div>

              <!-- 基础信息 -->
              <div class="info">
                <div class="base">
                  {{ user.nickName || user.username }}
                  <el-tooltip
                    v-if="userRoles"
                    effect="dark"
                    placement="bottom-end"
                  >
                    <span class="roles-handle">【角色】</span>
                    <div
                      slot="content"
                      :class="['roles', userRoles.length > 1 ? '' : 'alone']"
                    >
                      <div
                        class="item"
                        v-for="(role, index) in userRoles"
                        :key="index"
                      >
                        <span>{{ role }}</span>
                      </div>
                    </div>
                  </el-tooltip>
                </div>
                <div class="id">{{ user.mobile || user.username }}</div>
              </div>

              <!-- 更多操作 -->
              <span class="el-dropdown-link">
                <i class="kd-icon kd-icon-sort action-handle" />
              </span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="modalModifyPassword">
                修改密码
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <span class="color-red">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <TagNav />
      <div class="body">
        <router-view />
      </div>
    </div>
    <div class="mask" @click="handleContentTap" />

    <ModalModifyPassword
      v-model="modalModifyPassword"
      :operator="modifyPasswordUser"
    />

    <ModalGetToken
      v-if="hasPermission('d5bc2787-7bbc-421b-a271-52fb8ad89b6d', 'FUNCTION')"
      v-model="modalGetToken"
    />
  </div>
</template>

<script>
import { GetOperatorDetail } from '@/api/system/operator';

export default {
  name: 'Main',
  components: {
    TagNav: () => import('_c/TagNav'),
    Nav: () => import('./components/Nav'),
    ModalGetToken: () => import('./components/ModalGetToken'),
    ModalModifyPassword: () =>
      import('@/views/system/operator/components/ModalModifyPassword')
  },
  data() {
    return {
      modalModifyPassword: false,
      modalGetToken: false,
      sideToggled: false,
      modifyPasswordUser: null,
      notices: [] // 通知消息
    };
  },
  computed: {
    // 登录用户的角色
    userRoles() {
      const { user } = this;
      if (!user) return null;
      if (!user.roles) return [];
      return user.roles.split(',');
    },

    // 当前页面标题
    pageTitle() {
      try {
        return [...this.breadcrumbs].pop().title;
      } catch (error) {
        return '首页';
      }
    },

    // 获取当前路由的第一层
    routeTopic() {
      if (this.$route.name === 'home') return this.$route;
      return this.$route.matched[0];
    },

    // 面包屑
    breadcrumbs() {
      let _res = [];

      if (this.$route.name === 'home') return [];

      try {
        const { matched } = this.$route;

        if (this.$route.name === 'name') {
          _res.push({
            title: '管理中心',
            to: { name: 'name' }
          });
          return _res;
        } else {
          matched.forEach(route => {
            const { meta } = route;
            if (
              !(route.redirect && route.redirect.name == this.$route.name) &&
              meta
            ) {
              _res.push({
                title: meta.title,
                to: { name: route.name }
              });
            }
          });
        }
      } catch (error) {
        console.error(error);
      }

      return _res;
    }
  },
  watch: {
    $route() {
      this.sideToggled = false;
    }
  },

  methods: {
    // 菜单操作
    async handleMenuCommand(name) {
      if (name === 'modalModifyPassword') {
        try {
          this.modifyPasswordUser = await GetOperatorDetail(this.user.userId);
          this.modalModifyPassword = true;
        } catch (error) {
          this.msg({
            type: 'error',
            content: error
          });
        }

        return;
      }

      if (name === 'logout') {
        this.handleLogout();
        return;
      }
    },

    // 内容区域点击监听
    handleContentTap(e) {
      if (
        !e.target.className.includes('icon-side-toggle') &&
        this.sideToggled
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.sideToggled = false;
        return;
      }
    }
  }
};
</script>

<style lang="scss">
// 角色组
.roles {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  margin: -5px;
  padding: 5px;
  max-width: 280px;
  max-height: 400px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }

  &-handle {
    cursor: pointer;
  }

  .item {
    box-sizing: border-box;
    padding: 5px;
    width: 50%;
  }

  &.alone .item {
    width: 100%;
  }

  span {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px rgba(255, 255, 255, 0.3) solid;
    border-radius: 2px;
    cursor: pointer;
    display: block;
    color: #fff;
    padding: 6px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    white-space: nowrap;

    &:hover {
      border-color: #fff;
      background-color: #fff;
      color: #333;
    }
  }
}
</style>

<style lang="scss">
@import './style.scss';
</style>
