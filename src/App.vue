<script setup>
import Swal from "sweetalert2";
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

  if (!localStorage.getItem("info")) {
    await Swal.fire({
      title: "¡Hola, bienvenidos a DDSC 2!",
      text: "Esta es una beta pública: el diseño y funcionalidades pueden cambiar en cualquier momento. Nos gustaría saber sus retro-alimentaciones por medio de nuestro servidor de discord (Team DDSC Web)!.",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Entrar",
      allowOutsideClick: false, // Evita el cierre al hacer clic fuera
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("info", "true");
      } else {
        window.open("https://www.dokidokispanish.club", "_self");
      }
    });
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
