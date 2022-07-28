<template>
  <el-card shadow="never">
    <h4 slot="header">文字配色</h4>
    <p>内置样式还提供了多种文字配色，具体如下：</p>
    <p class="color-red">文字颜色 #ff4747 .color-red / .color-danger</p>
    <p class="color-orange">文字颜色 #ff9242 .color-orange / .color-warning</p>
    <p class="color-yellow">文字颜色 #ecb601 .color-yellow</p>
    <p class="color-green">文字颜色 #74bb45 .color-green / .color-success</p>
    <p class="color-blue">文字颜色 #09f .color-blue / .color-info</p>
    <p class="color-cyan">文字颜色 #11adb3 .color-cyan</p>
    <p class="color-gray">文字颜色 #999 .color-gray</p>
    <p class="color-dark">文字颜色 #111 .color-dark</p>
    <p class="color-white" style="background: #ccc">
      文字颜色 white .color-white
    </p>
    <p>用法参考：</p>
    <el-dropdown>
      <el-button size="small">下拉菜单</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>查看详情</el-dropdown-item>
        <el-dropdown-item>
          <div class="color-success">编辑</div>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <div class="color-danger">删除</div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-card>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 0.8rem;
}
</style>
