<template>
  <div class="operator-store">
    <el-transfer
      v-model="checked"
      :data="stores"
      :titles="['门店列表', '已配置']"
      @change="handleChange"
    >
      <div slot="left-footer" class="flex main-end" style="padding: 4px;">
        <el-button size="small" type="primary" plain @click="handleChangeAll">
          全选
        </el-button>
      </div>
      <div slot="right-footer" class="flex main-end" style="padding: 4px;">
        <el-button size="small" @click="handleClear">
          清空
        </el-button>
      </div>
    </el-transfer>
  </div>
</template>

<script>
export default {
  name: 'OperatorStore',
  props: {
    // 门店列表
    value: {
      type: Array,
      default: () => []
    },

    // 门店数据
    stores: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checked: this.$props.value || []
    };
  },
  watch: {
    value() {
      this.checked = this.$props.value || [];
    }
  },
  methods: {
    handleChange() {
      this.$emit('input', this.checked);
    },

    // 全选
    handleChangeAll() {
      this.checked = [...this.$props.stores].map(row => row.key);
      this.$emit('input', this.checked);
    },

    // 清空
    handleClear() {
      this.checked = [];
      this.$emit('input', this.checked);
    }
  }
};
</script>
