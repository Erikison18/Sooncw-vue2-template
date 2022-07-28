<template>
  <div class="nav-item">
    <!-- 触发元素 -->
    <div
      :class="handleClasses"
      v-if="hasChild"
      @click.stop="expanded = !expanded"
    >
      <div class="inner">
        <i :class="item.icon" />
        <transition name="el-fade-in">
          <span v-if="!collapse" class="title" :title="item.title">
            {{ item.title }}
          </span>
        </transition>
        <i
          v-if="hasChild && !collapse"
          class="kd-icon kd-icon-arrow_right arrow"
        />
      </div>
    </div>

    <div v-else :class="handleClasses">
      <router-link class="inner" :to="item.to">
        <i :class="item.icon" />
        <transition name="el-fade-in">
          <span v-if="!collapse" class="title" :title="item.title">
            {{ item.title }}
          </span>
        </transition>
      </router-link>
    </div>

    <!-- 子级 -->
    <template v-if="hasChild">
      <el-collapse-transition>
        <div v-show="expanded || isActive" class="child">
          <NavItem
            v-for="(sub, index) in item.child"
            :key="index"
            :item="sub"
          />
        </div>
      </el-collapse-transition>
    </template>
  </div>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    // 菜单条目数据
    item: {
      type: Object,
      default() {
        return {};
      }
    },

    // 是否水平折叠收起菜单
    collapse: Boolean
  },
  data() {
    return {
      expanded: false
    };
  },
  computed: {
    // 条目样式
    handleClasses: function() {
      const { collapse } = this.$props;
      const { expanded, isActive } = this;
      return {
        handle: true,
        expanded,
        active: isActive,
        collapse
      };
    },

    // 是否存在子级
    hasChild: function() {
      try {
        const { item } = this.$props;
        if (!item) return false;
        return Array.isArray(item.child);
      } catch (error) {
        return false;
      }
    },

    // 是否高亮展示
    isActive: function() {
      try {
        const { item } = this.$props;
        if (!item) return false;
        const { matched } = this.$route;
        return [...matched].map(m => m.name).includes(item.name);
      } catch (error) {
        return false;
      }
    }
  },
  watch: {
    $route: function() {
      this.$forceUpdate();
    },

    // 高亮时，展开子级
    isActive: function(active) {
      this.expanded = active;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../styles/const.scss';

// 菜单条目
.nav-item {
  margin-top: $void;
  position: relative;

  & > .handle {
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    position: relative;

    & > .inner {
      color: $colorText;
      border-radius: 4px;
      align-items: center;
      cursor: inherit;
      display: flex;
      flex: 1;
      text-decoration: none;

      & > .kd-icon {
        color: darken($colorBorder, 10%);
        font-size: 20px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        width: 48px;
      }

      & > .title {
        display: block;
        flex: 1;
        font-size: 0.95rem;
        font-weight: bold;
        line-height: 44px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      & > .arrow {
        color: darken($colorBorder, 10%);
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        transition: all 0.3s ease;
        width: 48px;
      }
    }

    &:hover > .inner {
      background-color: $colorBorderLight;
    }

    &.expanded > .inner,
    &.active > .inner {
      background-image: linear-gradient(to right, $colorPrimary, #00e0ec);

      & > .kd-icon,
      & > .title {
        color: white;
      }

      & > .arrow {
        transform: rotate(90deg);
      }
    }
  }

  // 子级
  & > .child {
    background-color: $bg;
    border-radius: 4px;
    margin-top: $void;
    position: relative;

    /deep/.nav-item {
      margin: 0;
    }

    /deep/.nav-item > .handle {
      & > .inner {
        border-radius: 4px;

        & > .title {
          font-size: 0.85rem;
          font-weight: normal;
          line-height: 40px;
          margin-left: 40px;
          margin-right: $void;
          padding: 0 $voidSmall;
        }
      }

      // 高亮
      &.active > .inner {
        background: darken($bg, 1%);

        & > .title {
          color: $colorPrimary;
          font-weight: bold;
        }

        & > .arrow {
          transform: rotate(450deg);
        }
      }
    }
  }
}
</style>
