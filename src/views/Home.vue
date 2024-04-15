<template>
  <uh-header></uh-header>
  <uh-aside></uh-aside>
  <div class="content-box" :class="{ 'content-collapse': collapse }">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import UhHeader from "@/components/layouts/UhHeader.vue";
import UhAside from "@/components/layouts/UhAside.vue";
import emitter from "@/utils/emitter";

const collapse = ref(false);
emitter.on("collapse", (msg) => {
  collapse.value = msg as boolean;
});
</script>

<style scoped>
.content-box {
  position: absolute;
  left: 150px;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
  transition: left 0.3s ease-in-out;
  padding: 20px;
}

.content-collapse {
  left: 65px;
}
</style>
