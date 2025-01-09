<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Header></Header>
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <Footer></Footer>
</template>

<style scoped>
main {
  width: 100%;
  position: relative;
  padding-top: 7%;
  background: url(./assets/gui/Azur_Lane.png);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}
</style>
