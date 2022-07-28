<template>
  <el-card shadow="never">
    <h4 slot="header">Flex</h4>
    <p>提供了 flex 辅助布局样式，这可以解决大部分布局问题，用法如下：</p>
    <p>默认情况下，给元素添加 .flex 属性，所有元素靠左上角并列排列：</p>
    <div class="layout padding flex">
      <div class="block">元素</div>
      <div class="block">元素</div>
      <div class="block">元素</div>
      <div class="block">元素</div>
    </div>
    <p>.cros-* 控制子元素垂直（上下）方向的对齐方式：</p>
    <div class="layout padding flex cros-center">
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block" style="line-height: 80px">元素</div>
    </div>
    <p>
      cros-*
      支持的属性有：.cros-start（顶端对齐）、.cros-center（上下居中）.cros-end（底部对齐）、.cros-stretch（上下拉伸）、.cros-baseline（水平基线）、.cros-none（无）。
    </p>
    <p>注意：cros-stretch 会拉伸子元素的高度：</p>
    <div class="layout padding flex cros-stretch">
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block" style="line-height: 80px">元素</div>
    </div>
    <p>
      .main-* 控制子元素水平（左右）方向的对齐方式，main-*
      支持的属性有：.main-start（左对齐）、.main-center（居中对齐）、.main-end（右对齐）、.main-space-between（两侧分散对齐）、.main-space-around（均匀分布对齐）
    </p>
    <p>默认，左对齐：</p>
    <div class="layout padding flex cros-center main-start">
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block" style="line-height: 80px">元素</div>
    </div>
    <p>居中对齐：</p>
    <div class="layout padding flex cros-center main-center">
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block" style="line-height: 80px">元素</div>
    </div>
    <p>右侧对齐：</p>
    <div class="layout padding flex cros-center main-end">
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block" style="line-height: 80px">元素</div>
    </div>
    <p>两端对齐：</p>
    <div class="layout padding flex cros-center main-space-between">
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block" style="line-height: 80px">元素</div>
    </div>
    <p>分散对齐：</p>
    <div class="layout padding flex cros-center main-space-around">
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block" style="line-height: 80px">元素</div>
    </div>
    <p>.expand 属性可以让某个子元素占据剩余空间</p>
    <div class="layout padding flex cros-center">
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block expand" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block expand" style="line-height: 80px">元素</div>
    </div>
    <p>
      当子元素特别多时，如果需要换行显示，可给 flex 元素继续添加 .wrap 属性：
    </p>
    <div class="layout padding flex wrap cros-start">
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block expand" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block expand" style="line-height: 80px">元素</div>
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block expand" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block expand" style="line-height: 80px">元素</div>
      <div class="block" style="line-height: 40px">元素</div>
      <div class="block expand" style="line-height: 20px">元素</div>
      <div class="block" style="line-height: 60px">元素</div>
      <div class="block expand" style="line-height: 80px">元素</div>
    </div>
    <p>实战用法：</p>
    <div class="flex margin-large-bottom">
      <el-form size="small" inline>
        <el-form-item style="margin-bottom: 0;">
          <el-input placeholder="请按输入关键字" />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button type="primary" plain>搜索</el-button>
          <el-button type="default" plain>重置</el-button>
        </el-form-item>
      </el-form>
      <div class="expand" />
      <el-pagination
        :current-page="1"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="10"
        layout="total, prev, next"
        :total="50"
        background
      />
      <div class="options margin-large-left">
        <el-button size="small" type="primary" plain>导出</el-button>
        <el-button size="small" type="success" plain>新增数据</el-button>
      </div>
    </div>

    <div class="flex cros-center">
      <div class="expand">
        <div class="color-gray padding-x" style="font-size: 12px;">
          当前共 50 条数据
        </div>
      </div>
      <div class="margin-left">
        <el-pagination
          :current-page="1"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="50"
        />
      </div>
    </div>
  </el-card>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 0.8rem;
}
.layout {
  border: 1px #edefff solid;
  margin-bottom: 0.8rem;
}

.layout > span,
.layout > .block {
  background-color: #edefff;
  border-radius: 4px;
  display: block;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
}

.layout > .block {
  margin: 5px;
  padding: 12px 20px;
  min-width: 100px;
}
</style>
