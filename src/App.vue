<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

import { useInfoToken } from "./composables/useInfoToken";
const { urlFondo, getToken, tokenData } = useInfoToken();

const defaultColor = ref("#a610ac"); // Color predeterminado
const defaultColorTrasnparent = ref("54"); // Color predeterminado
const selectedColor = ref(defaultColor);

function setRootColor(color) {
  const root = document.documentElement;
  root.style.setProperty("--color_fondo", color);
  root.style.setProperty(
    "--color_fondo_transparente",
    color + defaultColorTrasnparent.value
  );
}

onMounted(async () => {
  await getToken();
  if (tokenData.value !== undefined) {
    const storedColor = localStorage.getItem("myColor") || defaultColor.value;
    selectedColor.value = storedColor;
    setRootColor(storedColor); // Aplica el color al :root
  } else {
    const storedColor = defaultColor.value;
    selectedColor.value = storedColor;
    setRootColor(storedColor); // Aplica el color al :root
  }
});
</script>

<template>
  <Header></Header>
  <main :style="{ backgroundImage: `url(${urlFondo})` }">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <Footer></Footer>
</template>

<style>
:root {
  --my-global-color: #a610ac;
}
main {
  padding-top: 2dvh;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 90dvh !important;
}
</style>
