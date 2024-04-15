<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      background-color="#ffffff"
      active-text-color="#30a4fc"
      default-active="2"
      router
      :collapse="collapse"
    >
      <el-menu-item index="info">
        <el-icon><pie-chart /></el-icon>
        <span>Dashboard</span>
      </el-menu-item>

      <el-menu-item index="user">
        <el-icon><User /></el-icon>
        <span>Users</span>
      </el-menu-item>
  
      <el-menu-item index="itemList">
        <el-icon><Document /></el-icon>
        <span>Items</span>
      </el-menu-item>

      <el-menu-item index="fund">
        <el-icon><Money /></el-icon>
        <span>Fund</span>
      </el-menu-item>


    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { PieChart, Document, User, Money } from "@element-plus/icons-vue";
import emitter from "@/utils/emitter";


const collapse = ref(false);
emitter.on("collapse", (msg) => {
  collapse.value = msg as boolean;
});

</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar > ul {
  height: 100%;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 150px;
}
</style>
