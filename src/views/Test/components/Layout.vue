<template>
  <el-card shadow="never">
    <h4 slot="header">布局</h4>

    <el-row class="layout" :gutter="10">
      <el-col :span="1" v-for="i in 24" :key="i">
        <span>1</span>
      </el-col>
    </el-row>

    <el-row class="layout margin-top" :gutter="10">
      <el-col :span="5"><span>5</span></el-col>
      <el-col :span="19"><span>19</span></el-col>
    </el-row>

    <el-row class="layout margin-top" :gutter="10">
      <el-col class="el-col-s5"><span>s5</span></el-col>
      <el-col class="el-col-s5"><span>s5</span></el-col>
      <el-col class="el-col-s5"><span>s5</span></el-col>
      <el-col class="el-col-s5"><span>s5</span></el-col>
      <el-col class="el-col-s5"><span>s5</span></el-col>
    </el-row>

    <el-row class="layout margin-top" :gutter="10">
      <el-col :span="6"><span>6</span></el-col>
      <el-col :span="6"><span>6</span></el-col>
      <el-col :span="6"><span>6</span></el-col>
      <el-col :span="6"><span>6</span></el-col>
    </el-row>

    <el-row class="layout margin-top" :gutter="10">
      <el-col :span="8"><span>8</span></el-col>
      <el-col :span="8"><span>8</span></el-col>
      <el-col :span="8"><span>8</span></el-col>
    </el-row>

    <el-row class="layout margin-top" :gutter="10">
      <el-col :span="12"><span>12</span></el-col>
      <el-col :span="12"><span>12</span></el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.layout span {
  background-color: #edefff;
  border-radius: 4px;
  display: block;
  font-size: 0.8rem;
  font-weight: bold;
  line-height: 40px;
  text-align: center;
}
</style>
