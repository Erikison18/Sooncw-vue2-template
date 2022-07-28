<template>
  <el-card shadow="never">
    <div slot="header" class="flex cros-center">
      <div class="expanded margin-right">
        <h4>HTTP axios</h4>
      </div>
      <el-button
        type="primary"
        size="small"
        :loading="pending"
        plain
        @click="initBase"
      >
        刷新数据
      </el-button>
      <sc-excel-export
        class="margin-left"
        file-name="表格"
        :data="posts"
        :columns="postsExportColumns"
        @on-success="handleExportSuccess"
        @on-error="handleExportError"
      >
        <el-button type="primary" size="small">
          导出
        </el-button>
      </sc-excel-export>
    </div>
    <el-table
      v-watermark
      v-loading="pending"
      :data="posts"
      height="calc(100vh - 400px)"
      border
      stripe
    >
      <el-table-column align="center" type="index" width="64" />
      <el-table-column prop="title" label="标题" min-width="180">
        <template slot="header">
          <div class="text-align-center">标题</div>
        </template>
        <template slot-scope="scope">
          <a
            class="links padding-x overflow-ellipsis"
            :href="`https://cnodejs.org/topic/${scope.row.id}`"
            target="_blank"
          >
            {{ scope.row.title }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="create_at"
        label="发布日期"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.create_at | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="visit_count"
        label="阅读"
        width="180"
      />
    </el-table>

    <div
      v-loading="submiting"
      class="margin-large-top"
      style="background-color: #fafafa; border: 1px #ddd solid; border-radius: 4px; padding: 60px;"
    >
      <el-form style="margin: 0 auto; max-width: 480px">
        <h4 class="margin-large-bottom padding-x">表单提交和重置</h4>
        <el-form-item>
          <el-input v-model="form.username" placeholder="Username" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.signture" placeholder="Signture" />
        </el-form-item>
        <div class="flex main-space-between">
          <el-button @click="handleFormReset">
            取消
          </el-button>
          <el-button type="success" @click="handleFormSubmit">
            提交
          </el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>

<script>
// 导入接口
import { DemoGet, DemoPostParams, DemoPost } from "@/api/Demo";

export default {
  data() {
    return {
      pending: false,
      form: { ...DemoPostParams },
      posts: [],
      postsTotal: 0,

      // 建议添加状态锁定变量，以避免页面多次点击
      submiting: false,
      postsExportColumns: [
        {
          key: "id",
          title: "ID"
        },
        {
          key: "title",
          title: "标题"
        },
        {
          key: "create_at",
          title: "发布日期",
          format: value => {
            const { dateFormat } = this.$options.filters;
            return dateFormat(value);
          }
        },
        {
          key: "visit_count",
          title: "阅读数"
        }
      ]
    };
  },
  methods: {
    // GET 请求
    async initBase() {
      try {
        this.pending = true;

        const data = await DemoGet();

        this.posts = data.data;
        this.postsTotal = data.total;
      } catch (error) {
        this.message({
          type: "error",
          message: error
        });
      } finally {
        this.pending = false;
      }
    },

    // 重置表单
    handleFormReset() {
      this.form = { ...DemoPostParams };
    },

    // 提交表单
    async handleFormSubmit() {
      try {
        // 显示遮罩，同时可避免重复提交
        this.submiting = true;

        // 发出请求
        const data = await DemoPost(this.form);

        // 回显数据
        console.log(data);

        // 重置表单
        this.form = { ...DemoPostParams };

        // 打印消息
        this.msg({
          type: "success",
          message: "操作成功"
        });
      } catch (error) {
        // 打印错误
        this.msg({
          type: "error",
          message: error
        });
      } finally {
        // 无论成功、失败，关闭遮罩
        this.submiting = false;
      }
    },

    // 导出成功
    handleExportSuccess(params) {
      this.msg({
        type: "success",
        message: params.message
      });
    },

    // 导出失败
    handleExportError(error) {
      this.msg({
        type: "error",
        message: error
      });
    }
  },
  mounted() {
    this.initBase();
  }
};
</script>
