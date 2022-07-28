<template>
  <div class="tag-nav">
    <i
      class="kd-icon kd-icon-arrow_fill_left control control-flip control-prev"
      :disabled="history.length <= 1"
      @click="prev"
    />
    <i
      class="control control-home kd-icon kd-icon-home"
      @click="handleToHome"
    />
    <div class="container" ref="scroll">
      <ul ref="list" :style="{ left: scrollLeft + 'px' }">
        <TagNavItem
          v-for="(route, index) in history"
          :key="index"
          :item="route"
          :icon="route.name === 'home' ? 'kd-icon kd-icon-home' : ''"
          :dot="route.name !== 'home'"
          :close="route.name !== 'home'"
          @on-contextmenu="handleItemContextMenu"
          @on-close="handleItemClose"
        />
      </ul>
    </div>
    <i
      class="kd-icon kd-icon-arrow_fill_right control control-flip control-next"
      :disabled="history.length === 0"
      @click="next"
    />
    <i
      class="kd-icon kd-icon-list control control-all"
      :disabled="history.length === 0"
      @click="maps = true"
    />
    <!-- 右键菜单 -->
    <div
      v-show="contextMenu"
      ref="contextmenu"
      class="context-menu"
      :style="contextMenuStyle"
      @contextmenu.prevent
    >
      <ul>
        <li
          v-if="
            contextMenuData &&
              contextMenuData[1] &&
              contextMenuData[1].name !== 'home'
          "
          @click="handleContextMenuChange('closeSelf')"
        >
          <span>关闭该页面</span>
        </li>
        <li @click="handleContextMenuChange('closeOther')">
          <span>关闭其他</span>
        </li>
        <li
          :disabled="
            contextMenuData && contextMenuData[0] === history.length - 1
          "
          @click="handleContextMenuChange('closeRights')"
        >
          <span>关闭右侧其他</span>
        </li>
        <li
          :disabled="history.length <= 1"
          @click="handleContextMenuChange('closeAll')"
        >
          <span>关闭全部</span>
        </li>
      </ul>
    </div>
    <el-drawer
      title="速览"
      size="300px"
      :closable="false"
      :visible.sync="maps"
      append-to-body
    >
      <div class="history-list">
        <router-link
          v-for="(route, index) in history"
          :to="route.fullPath"
          :key="index"
          :title="`${origin}${route.fullPath}`"
        >
          <span>{{ route.meta.title }}</span>
        </router-link>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'TagNav',
  components: {
    TagNavItem: () => import('./TagNavItem')
  },
  data() {
    return {
      contextMenu: false,
      contextMenuPosition: [0, 0],
      contextMenuData: [],
      scrollLeft: 0,
      resizeTimer: null,
      maps: false
    };
  },
  computed: {
    ...mapState('tagNav', {
      history: state => state.history
    }),

    ...mapGetters({
      historyFlat: 'tagNav/flat'
    }),

    origin() {
      return window.location.origin;
    },

    // 高亮索引
    currentIndex() {
      const { $route } = this;
      return this.history.findIndex(
        route => route.fullPath === $route.fullPath
      );
    },

    // 右键菜单位置
    contextMenuStyle() {
      const { contextMenuPosition } = this;
      return {
        left: `${contextMenuPosition[0]}px`,
        top: `${contextMenuPosition[1]}px`
      };
    }
  },
  watch: {
    $route(to, from) {
      const { $route } = this;

      // 隐藏UI
      this.maps = false;
      this.contextMenu = false;

      // 重定向 和 明确指定不显示到标签 的路由不予处理
      if (!$route.meta || $route.meta.redirect || !$route.meta.tag) return;

      // 追加到标签
      this.$store.dispatch('tagNav/push', this.getRouteSource($route, from));

      // 更新到视图
      this.$nextTick(() => {
        this.moveToView();
      });
    },

    // 右键菜单显示时，监听文档点击事件
    contextMenu(visible) {
      if (!visible) {
        document.removeEventListener('click', this.changeClickTarget, false);
      } else {
        document.addEventListener('click', this.changeClickTarget, false);
      }
    }
  },
  methods: {
    // 解析路由属性，避免出现循环引用
    getRouteSource(route, from) {
      return {
        fullPath: route.fullPath,
        name: route.name,
        meta: route.meta,
        query: route.query,
        params: route.params,
        from: from ? from.fullPath : null // 记住来源位置
      };
    },

    // 条目右键菜单
    handleItemContextMenu(e, index, route) {
      // 显示菜单
      this.contextMenu = true;

      // 获取当前菜单的位置和尺寸
      const menuRect = this.$el.getBoundingClientRect();

      // 缓存数据
      // 设置右键菜单缓存数据，【条目索引,条目数据】
      this.contextMenuData = [index, route];

      // 控制菜单的位置
      this.contextMenuPosition = [
        e.clientX - menuRect.x,
        e.clientY - menuRect.y
      ];
    },

    // 检测文档点击是否在右键菜单内
    changeClickTarget(e) {
      if (!this.$refs.contextmenu.contains(e.target)) {
        this.contextMenu = false;
        this.contextMenuData.splice(0);
      }
    },

    // 右键菜单条目选择
    handleContextMenuChange(type) {
      const { contextMenuData } = this;

      // 关闭菜单
      this.contextMenu = false;

      switch (type) {
        // 关闭当前页面
        case 'closeSelf':
          this.removeItem(contextMenuData[0], contextMenuData[1]);
          break;

        // 关闭其他页面
        case 'closeOther':
          this.$store.dispatch('tagNav/spliceExcept', [
            '/home/main',
            contextMenuData[1].fullPath
          ]);
          this.$router.push(contextMenuData[1].fullPath);
          break;

        // 关闭右侧页面
        case 'closeRights':
          this.$store.dispatch('tagNav/splice', {
            index: contextMenuData[0],
            rights: true
          });
          this.$router.push(contextMenuData[1].fullPath);
          break;

        // 关闭全部页面
        case 'closeAll':
          this.$store.dispatch('tagNav/splice', {
            index: 0
          });
          this.$router.push('/');
          break;

        default:
          break;
      }
    },

    // 条目删除回调
    handleItemClose(index, route) {
      this.removeItem(index, route);
    },

    // 尺寸调整
    resize() {
      // 隐藏菜单
      this.contextMenu = false;
      // 清除计时器
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(this.moveToView, 300);
    },

    // 滚动指定标签到可视区域
    moveToView() {
      let scroll = 0;

      // 获取滚动区域和列表的尺寸
      const scrollRect = this.$refs.scroll.getBoundingClientRect();
      const listRect = this.$refs.list.getBoundingClientRect();

      // 最小和最大可滚动宽度
      const min = scrollRect.width / 2;
      const max = -(listRect.width - scrollRect.width);

      // 如果滚动列表宽度小于可视区域宽度，不做操作
      if (listRect.width < scrollRect.width) {
        this.scrollLeft = scroll;
        return;
      }

      // 获取当前高亮的标签
      const tag = Object.values(this.$refs.list.children).find(child => {
        return child.className.indexOf('active') !== -1;
      });

      // 标签移动到列表中间位置
      scroll = -(tag.offsetLeft - min + tag.offsetWidth / 2);
      scroll = Math.min(scroll, 0);
      scroll = Math.max(scroll, max);

      this.scrollLeft = scroll;
    },

    // 移除指定元素
    removeItem(index, route) {
      const { $route, history, historyFlat } = this;
      // 删除条目
      this.$store.dispatch('tagNav/splice', {
        index,
        length: 1
      });

      // 关闭了高亮标签时，回退历史记录
      if ($route.fullPath === route.fullPath) {
        // 如果来源路由存在于当前标签列表，则切换回去
        if (historyFlat.find(item => item === route.from)) {
          this.$router.push(route.from);
          return;
        }

        // 否则，切换到邻近的那个标签
        let slibing = history[index - 1];
        if (!slibing) {
          slibing = history[index + 1];
        }
        this.$router.push(slibing.fullPath);
      }
    },

    // 上一个标签
    prev() {
      const { currentIndex, historyFlat } = this;
      if (currentIndex <= 0) return;
      this.$router.push(historyFlat[currentIndex - 1]);
    },

    // 下一个标签
    next() {
      const { currentIndex, historyFlat } = this;
      if (currentIndex >= historyFlat.length - 1) return;
      this.$router.push(this.historyFlat[currentIndex + 1]);
    }
  },
  created() {
    if (this.$route.name === 'home') return;
    // 初始化
    this.$store.dispatch('tagNav/push', this.getRouteSource(this.$route));
    window.addEventListener('resize', this.resize, false);
  },
  beforeDestroy() {
    this.$store.dispatch('tagNav/splice');
    console.log('beforeDestroy')
    window.removeEventListener('resize', this.resize, false);
  }
};
</script>

<style lang="scss" scoped>
@import '../../../styles/const.scss';

.tag-nav {
  height: 39px;
  position: relative;

  *[disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &::after {
    border-bottom: 1px $colorBorder solid;
    content: '';
    height: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  // 控制按钮
  .control {
    background-color: #fff;
    border-right: 1px $colorBorder solid;
    color: $colorTextLight;
    cursor: pointer;
    flex-shrink: 0;
    height: 38px;
    line-height: 38px;
    position: absolute;
    text-align: center;
    top: 0;
    width: 38px;
    z-index: 2;

    &-home {
      left: 25px;
    }

    &-flip {
      width: 24px;
    }

    &-prev {
      left: 0;
    }

    &-next {
      border-left: 1px $colorBorder solid;
      right: 38px;
    }

    &-all {
      right: 0;
    }

    &:last-of-type {
      border-right: none;
    }

    &:hover {
      background-color: fade($colorBorder, 30%);
    }

    &::before {
      display: block;
      transition: all 0.3s ease;
    }

    &.collapsed::before {
      transform: rotate(90deg);
    }
  }

  // 列表
  .container {
    bottom: 0;
    flex: 1;
    height: 36px;
    left: 64px;
    overflow: hidden;
    padding: 2px 0;
    position: absolute;
    right: 64px;
    top: 0;
    z-index: 2;

    & > ul {
      align-items: flex-start;
      display: flex;
      flex: 1;
      flex-wrap: nowrap;
      list-style: none;
      padding: 0 2px;
      position: relative;
      transition: all 0.6s ease;
      width: fit-content;
    }
  }

  // 右键菜单
  .context-menu {
    background-color: white;
    border-radius: 3px;
    border: 1px $colorBorder solid;
    box-shadow: 0 6px 12px fade-out($colorBorder, 0.5);
    left: 10px;
    top: 10px;
    position: absolute;
    z-index: 3;

    ul {
      padding: 8px 0;
      list-style: none;

      li {
        cursor: pointer;
        padding: 4px 10px;
        position: relative;
        line-height: 20px;

        span {
          display: block;
          font-size: 0.8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
          white-space: nowrap;
          width: 128px;
        }

        &:hover {
          background-color: fade-out($colorBorder, 0.5);
        }
      }
    }
  }
}

/deep/.el-drawer__header {
  margin-bottom: 20px;
}

/deep/.el-drawer__body {
  background-color: white;
  overflow: auto;
  scroll-behavior: smooth;
}

.history-list {
  padding: $void;
  position: relative;

  a {
    border-radius: 4px;
    color: $colorText;
    display: block;
    margin: $void 0;
    padding: $void $void * 1.5;
    line-height: 32px;
    text-decoration: none;

    span {
      display: block;
      font-size: 1rem;
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: none;
      white-space: nowrap;
    }

    &:hover {
      background-color: fade-out($colorBorder, 0.5);
    }

    &.router-link-exact-active {
      background-color: $colorSecond;
      color: white;
      font-weight: bold;
    }
  }
}
</style>
