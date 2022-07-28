<template>
  <el-popover
    v-model="visible"
    placement="bottom-end"
    trigger="click"
    transition="none"
    size="mini"
  >
    <button slot="reference" class="column-toggle" size="mini">
      <el-tooltip content="显示/隐藏列" placement="top">
        <i class="kd-icon kd-icon-column" />
      </el-tooltip>
    </button>
    <div class="contents">
      <h4>显示/隐藏列</h4>
      <el-checkbox-group v-model="checked">
        <el-checkbox
          v-for="(item, index) in columns"
          :key="index"
          :label="item.prop"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
      <div class="options">
        <el-button size="mini" type="primary" plain @click="handleShowAll">
          显示全部
        </el-button>
        <el-button size="mini" type="success" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script>
// el-table 列显示隐藏切换
export default {
  name: 'ColumnToggle',
  props: {
    // 已选择的条目，支持 v-model="[]"
    value: {
      type: Array,
      default() {
        return [];
      }
    },

    // 列的 prop 集合
    // 格式：[{ prop: '列属性', label: '列标题', disabled: false }]
    columns: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      visible: false,
      checked: this.$props.value || []
    };
  },
  computed: {},
  watch: {
    value(value) {
      this.checked = value;
    }
  },
  methods: {
    // 显示全部
    handleShowAll() {
      this.checked = [...this.$props.columns].map(set => set.prop);
      this.handleSubmit();
    },

    // 提交修改
    handleSubmit() {
      this.visible = false;
      this.$emit('input', this.checked);
    }
  }
};
</script>

<style>
.el-popover {
  box-shadow: 0 16px 32px 0 rgb(0 0 0 / 5%);
  padding: 0 !important;
}
</style>

<style lang="scss" scoped>
@import '../styles/const.scss';

.column-toggle {
  background-color: #fff;
  border: 1px $colorBorder solid;
  border-radius: 4px;
  cursor: pointer;

  .kd-icon {
    align-items: center;
    display: flex;
    justify-content: center;
    font-size: 16px;
    height: 28px;
    width: 28px;
  }

  &:hover {
    border-color: darken($colorBorder, 10%);
    box-shadow: 0 0 0 3px $colorBorder;
    color: $colorPrimary;
  }
}

.contents {
  position: relative;
  max-width: 280px;

  h4 {
    border-bottom: 1px $colorBorder solid;
    font-size: 14px;
    font-weight: bold;
    padding: $void * 1.5 $void * 2;
  }

  .options {
    align-items: center;
    border-top: 1px $colorBorder solid;
    display: flex;
    justify-content: flex-end;
    padding: $void;
  }
}

/deep/.el-checkbox-group {
  max-height: 300px;
  overflow: auto;
  padding: $void $void * 2;

  .el-checkbox {
    align-items: center;
    display: flex;
    padding: $void * 0.6 0;

    .el-checkbox__inner {
      box-shadow: 0 0 0 2px fade-out($colorBorder, 0.5);
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
      box-shadow: 0 0 0 2px fade-out($colorPrimary, 0.8);
    }

    .el-checkbox__label {
      display: block;
      flex: 1;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
