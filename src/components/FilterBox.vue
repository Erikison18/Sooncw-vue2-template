<template>
  <el-form
    v-if="fields.length"
    class="padding-x"
    :model="form"
    size="mini"
    inline
    :disabled="disabled"
  >
    <template v-for="(field, index) in renderFields">
      <el-form-item
        v-if="!field.collapsed || !collapsed"
        :key="field.key || index"
        :label="field.title"
      >
        <!-- 文本类型 -->
        <el-input
          v-if="!field.widget || field.widget === 'text'"
          v-model="form[field.key]"
          :maxlength="field.maxlength || 256"
          :placeholder="field.placeholder"
          :style="field.style"
          :clearable="field.clearable"
        />

        <!-- 下拉框类型 -->
        <el-select
          v-if="field.widget === 'select'"
          v-model="form[field.key]"
          :placeholder="field.placeholder"
          :multiple="field.multiple"
          :collapse-tags="field.collapseTags"
          :style="field.style"
          @change="field.onChange || voidFunction"
          :clearable="field.clearable"
        >
          <template v-if="Array.isArray(field.enums) && field.enums.length">
            <el-option
              v-for="(item, fieldIndex) in field.enums"
              :key="fieldIndex"
              :label="item.value || item"
              :value="item.key || item"
            />
          </template>
        </el-select>

        <!-- 日期区间 -->
        <el-date-picker
          v-if="field.widget === 'datetime'"
          :type="field.type || 'date'"
          v-model="form[field.key]"
          :placeholder="field.placeholder"
          :style="field.style"
          :range-separator="field.rangeSeparator || '至'"
          :start-placeholder="field.startPlaceholder || '开始日期'"
          :end-placeholder="field.endPlaceholder || '结束日期'"
          :value-format="field.valueFormat"
          @change="field.onChange || voidFunction"
          :clearable="field.clearable"
        />

        <!-- 级联选择 -->
        <el-cascader
          v-if="field.widget === 'cascader'"
          v-model="form[field.key]"
          :placeholder="field.placeholder"
          :options="field.options"
          :props="field.props"
          :separator="field.separator"
          :show-all-levels="field.showAllLevels"
          :clearable="field.clearable"
          :filterable="field.filterable ? field.filterable : false"
          style="width: 100%;"
        />

        <!-- 单个复选框 -->
        <el-checkbox
          v-if="field.widget === 'checkbox'"
          v-model="form[field.key]"
        />

        <!-- TODO 自定义组件 -->
        <!-- <component v-if="field.render && field.widget" :is="field.widget" /> -->
      </el-form-item>
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleFilterSubmit"> 查询 </el-button>
      <el-button v-if="canReset" type="default" @click="handleFilterReset">
        重置
      </el-button>
      <el-button
        v-if="hasCollapser"
        class="padding-x"
        type="text"
        @click="handleFilterCollapse"
      >
        {{ collapsed ? '展开' : '收起' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
/**
 * 字段基础信息
const FIELD_DEFAULT = {
  // 标题
  title: null,

  // 取值
  key: null,

  // 占位提示
  placeholder: null,

  // 字段组件类型，取值范围
  // text 文本输入框 | number 数字输入 | select 下拉 | datetime 时间日期
  widget: "text",

  // 是否默认收起
  // 为 true 时，初始不可见，点击【展开】后可见
  collapsed: false,

  // 数据源
  // 当字段类型为 select、radio、checkbox 时，通过该参数指定枚举
  // 注意：每个枚举都需要遵循 key/value 的格式，key 为实际取值，value 为展示文本。
  // 如果不是，则请自行转换；
  enmus: [],

  // 下拉框是否启用多选选
  multiple: false,

  // 下拉框多选时，超出该值隐藏
  collapseTags: 1,

  // 自定义渲染
  render: null,
};
 */

// 搜索栏组件封装
export default {
  name: 'FilterBox',
  props: {
    // 数据对象
    value: {
      type: Object,
      default() {
        return null;
      }
    },

    // 默认参数，基于该参数重置表单
    defaults: {
      type: Object,
      default() {
        return null;
      }
    },

    // 启用更多
    enableCollapse: {
      type: Boolean,
      default: true
    },

    // 字段配置
    fields: {
      type: Array,
      default() {
        return [];
      }
    },

    // 是否禁用
    disabled: Boolean
  },
  data() {
    return {
      form: { ...(this.$props.defaults || {}), ...(this.$props.value || {}) },
      collapsed: true,
      voidFunction: () => {}
    };
  },
  computed: {
    renderFields() {
      const { fields } = this.$props;
      return [...fields].map(field => {
        return {
          clearable: true,
          ...field
        };
      });
    },

    formChanged() {
      return this.form;
    },

    // 是否存在查询参数
    canReset() {
      try {
        const { defaults } = this.$props;
        const { form } = this;
        if (defaults) {
          return (
            Object.values(form).join('') !== Object.values(defaults).join('')
          );
        }
        return Object.values(form).join('') !== '';
      } catch (error) {
        return false;
      }
    },

    // 预设字段中，是否存在可收起项
    hasCollapser() {
      const { fields } = this.$props;
      if (!Array.isArray(fields) || !fields.length) return false;
      return [...fields].filter(set => true === set.collapsed).length > 0;
    }
  },
  watch: {
    model() {
      this.initFields();
    },

    formChanged: {
      deep: true,
      handler() {
        this.$emit('input', this.form);
      }
    }
  },
  methods: {
    // 提交
    handleFilterSubmit() {
      this.$emit('on-submit', this.form);
    },

    // 重置
    handleFilterReset() {
      this.form = { ...(this.$props.defaults || {}) };
      this.$emit('on-reset', this.form);
    },

    // 展开收起
    handleFilterCollapse() {
      const { enableCollapse } = this.$props;
      if (!enableCollapse) return;
      if (!this.hasCollapser) return;
      this.collapsed = !this.collapsed;
    },

    initFields() {
      this.form = {
        ...(this.$props.defaults || {}),
        ...(this.$props.value || {})
      };
      this.$forceUpdate();
    }
  },
  mounted() {
    this.initFields();
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 10px !important;
}

// 修正日期区间分隔字符宽度挤压问题
/deep/.el-date-editor .el-range-separator {
  width: 32px !important;
}

/deep/.el-form-item__label {
  font-size: 12px;
}
</style>
