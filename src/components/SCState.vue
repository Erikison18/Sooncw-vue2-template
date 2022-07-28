<template>
  <div class="sc-state">
    <div v-if="type" class="sc-state-icon">
      <i :class="['el-icon', `el-icon-${icon}`, 'sc-state-icon']" />
    </div>

    <template v-if="!state">
      <div class="sc-state-icon" v-if="icon">
        <i :class="['el-icon', `el-icon-${icon}`, 'sc-state-icon']" />
      </div>

      <div
        :class="['sc-state-cover', `sc-state-cover-${imageSize}`]"
        v-if="image"
      >
        <img :src="image" alt />
      </div>
    </template>

    <div class="sc-state-title" v-if="title">{{ title }}</div>
    <div class="sc-state-title-sub" v-if="titleSub">{{ titleSub }}</div>
    <div class="sc-state-remark" v-if="remark">{{ remark }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "SCState",
  props: {
    // 类型，如果如需快捷展示内容，可以直接设置该值
    // 指定类型时，自定义图标和图片不可用
    type: {
      type: String,
      validator: value =>
        ["primary", "success", "danger", "warning", "info"].includes(value)
    },

    // 主标题
    title: String,

    // 副标题
    titleSub: String,

    // 备注
    remark: String,

    // 图片
    image: String,

    // 图片尺寸
    imageSize: {
      type: String,
      default: "normal",
      validator: size => ["normal", "small", "mini"].includes(size)
    },

    // 图标
    icon: String
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.sc-state {
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  padding: 64px 40px;
  position: relative;
  text-align: center;

  // 图标
  &-icon {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 40px;

    .el-icon {
      font-size: 48px;
      margin-bottom: 0;
    }
  }

  // 封面图
  &-cover {
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto 40px;
    position: relative;
    text-align: center;

    &,
    &-normal {
      width: 100%;
    }

    &-small {
      width: 64px;
    }

    &-mini {
      width: 24px;
    }

    img {
      max-width: 100%;
    }
  }

  // 标题
  &-title {
    font-size: 1.6rem;
    line-height: 40px;
    margin-bottom: 10px;
    font-weight: normal;
    text-align: center;
  }

  // 副标题
  &-title-sub {
    font-size: 1.1rem;
    line-height: 32px;
    margin-bottom: 10px;
    font-weight: normal;
    text-align: center;
  }

  // 备注
  &-remark {
    font-size: 1rem;
    line-height: 20px;
    margin-bottom: 40px;
  }
}
</style>
