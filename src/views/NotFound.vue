<template>
  <div class="continer">
    <SCState
      image="/images/states/404.svg"
      title="页面不存在"
      remark="页面不存在，请检查访问地址是否正确"
    >
      <el-button type="primary" size="small" plain>回主页</el-button>
    </SCState>
  </div>
</template>

<script>
export default {
  components: {
    SCState: () => import("_c/SCState")
  }
};
</script>
