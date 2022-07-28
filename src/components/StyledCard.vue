<template>
  <div class="styled-card">
    <div v-if="title || $slots.extra" class="styled-card-head">
      <div v-if="title" class="title">
        <i class="kd-icon kd-icon-card_adorn_arrow" />
        <span>{{ title }}</span>
      </div>
      <slot name="extra" />
    </div>
    <div v-if="$slots.default" class="styled-card-body">
      <slot />
    </div>
    <slot name="body" />
  </div>
</template>

<script>
export default {
  name: 'styledCard',
  props: {
    // 栏目标题
    title: String
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/const.scss';

.styled-card {
  background-color: white;
  border: 1px $colorBorder solid;
  border-radius: 4px;

  // 头部
  &-head {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: $void;
    position: relative;

    // 标题
    & > .title {
      align-items: center;
      display: flex;
      flex: 1;
      min-width: 200px;
      overflow: hidden;

      & > i {
        align-items: center;
        color: $colorPrimary;
        display: flex;
        height: 32px;
        margin-left: $voidSmall;
        margin-right: $voidSmall;
      }

      span {
        display: block;
        font-size: 1rem;
        font-weight: bold;
        line-height: 32px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  &-body {
    padding: 0 $void $void;
  }
}
</style>
