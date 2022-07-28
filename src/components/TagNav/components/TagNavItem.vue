<template>
  <li
    :class="['tag-nav-item', active ? 'active' : '']"
    @contextmenu.prevent="handleContextMenu($event)"
    @click="handleChange"
  >
    <div class="handle">
      <i v-if="icon" :class="['icon-base', icon]" />
      <span
        :class="['name', close ? '' : 'pind']"
        :title="item.meta.title || '无标题'"
      >
        {{ item.meta.title || '无标题' }}
      </span>
      <i v-if="close" class="el-icon-close icon-close" />
    </div>
  </li>
</template>

<script>
export default {
  name: 'TagNavItem',
  props: {
    // 路由条目
    item: {
      type: Object,
      required: true,
      default() {
        return null;
      }
    },

    // 图标
    icon: String,

    // 是否显示圆点
    dot: Boolean,

    // 是否可关闭
    close: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 是否激活
    active: function() {
      const { $route } = this;
      const { item } = this.$props;
      return $route.fullPath === item.fullPath;
    }
  },
  methods: {
    // 右键菜单
    handleContextMenu(e) {
      const { item } = this.$props;
      this.$emit('on-contextmenu', e, this.$vnode.key, item);
    },

    // 条目选择
    handleChange(e) {
      const { item } = this.$props;
      // 点击了关闭按钮
      if (e.target.className.indexOf('icon-close') !== -1) {
        return this.$emit('on-close', this.$vnode.key, item);
      }
      // 是否存在 param 参数
      // const hasParams = JSON.stringify(item.params) === "{}";
      // 默认执行跳转
      if (this.$route.fullPath === item.fullPath) return;
      this.$router.push(item.fullPath);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../styles/const.scss';

.tag-nav-item {
  background-color: #fff;
  cursor: pointer;
  border: 1px $colorBorder solid;
  border-radius: 2px;
  color: inherit;
  height: 28px;
  margin: 2px;
  padding: 0 $voidSmall;
  position: relative;
  text-decoration: none;
  transition: padding-top 0.4s ease;

  .handle {
    align-items: center;
    display: flex;
  }

  .name {
    color: darken($colorTextLight, 10%);
    display: block;
    font-size: 0.8rem;
    line-height: 28px;
    overflow: hidden;
    padding: 0 8px;
    text-overflow: ellipsis;
    max-width: 200px;
    user-select: none;
    white-space: nowrap;

    &.pind {
      padding-right: $void;
    }
  }

  .icon-base {
    color: $colorSecond;
    cursor: pointer;
    font-size: 16px;
    height: 28px;
    line-height: 26px;
    margin-left: 4px;
  }

  .icon-close {
    color: $colorTextLight;
    cursor: pointer;
    height: 28px;
    line-height: 28px;
    text-align: center;
    margin-right: 6px;
  }

  // 划过
  &:hover {
    border-color: $colorPrimary;
    background-color: fade-out($colorPrimary, 0.96);

    .name {
      color: $colorPrimary;
    }

    .icon-base {
      color: $colorSecond;
    }

    .icon-close {
      color: $colorTextLight;
    }
  }

  // 激活
  &.active {
    border-color: $colorBorder;
    border-bottom-color: $bg;
    background-color: $bg;
    border-radius: 2px 2px 0 0;
    height: 32px;
    padding-top: 2px;

    .name {
      color: $colorPrimary;
      font-weight: bold;
    }

    .icon-base {
      color: $colorPrimary;
    }
  }
}
</style>
