<template>
  <el-card shadow="never">
    <h4 slot="header">权限控制</h4>

    <el-button type="primary" plain @click="initAuth">
      初始化权限
    </el-button>

    <el-button type="success" plain @click="getAuthData">
      查看当前权限
    </el-button>

    <el-button type="success" plain @click="mergeAuthData">
      合并权限
    </el-button>

    <el-button type="danger" plain>
      删除一个权限节点
    </el-button>

    <el-button type="danger" plain @click="clearAuth">
      清空所有权限数据
    </el-button>
  </el-card>
</template>

<script>
import * as grant from "@/core/grant";

const user = {
  username: "admin",
  token: "LDASLKDJALKSJDLIAIS123123"
};

// 模拟权限数据
const rules = {
  menu: [
    {
      name: "UserProfile",
      title: "用户信息"
    }
  ],
  action: [
    {
      name: "UserProfileEdit",
      title: "用户信息编辑"
    }
  ],
  routes: []
};

export default {
  methods: {
    initAuth() {
      this.$store.dispatch("setUser", user);
      grant.setAuthUser(user);
      this.$auth.update(rules);
      console.log(this);
    },
    clearAuth() {
      this.$auth.clear();
    },
    getAuthData() {
      console.log(this.$auth.get("menu"));
      console.log(this.$auth.hasPermission("UserProfile*|Task|Many|User"));
    },
    mergeAuthData() {
      const menu = this.$auth.merge("menu", [
        {
          name: "Admin",
          label: "管理中心"
        },
        {
          name: "Task",
          label: "管理中心"
        }
      ]);
      console.log(menu);
    }
  },
  mounted() {
    console.log(this);
  }
};
</script>

<style></style>
