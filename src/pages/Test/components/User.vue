<template>
  <transition
    enter-active-class="animate__jackInTheBox"
    leave-active-class="animate__zoomOutDown"
  >
    <div class="animate__animated user" v-if="user">
      <el-avatar
        icon="el-icon-user-solid"
        :size="64"
        src="https://img.lanrentuku.com/img/allimg/1707/14988864745279.jpg"
      />
      <h4>{{ user.username }}</h4>
      <el-button size="mini" @click="handleLogout">
        退出登录
      </el-button>
    </div>
  </transition>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.user {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  align-items: center;
  display: flex;
  flex-direction: column;
  right: 40px;
  top: 140px;
  padding: 16px;
  position: fixed;
  z-index: 99;

  h4 {
    margin: 16px auto;
  }
}
</style>
