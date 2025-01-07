<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const transitionName = ref("fade"); // Estado reactivo para la transición
const route = useRoute(); // Obtén la información de la ruta actual

// Observa cambios en la ruta
watch(
  () => route, // Observar la ruta actual
  (to, from) => {
    // Cambia la animación según la dirección
    transitionName.value =
      to.meta.index > from.meta.index ? "slide-left" : "slide-right";
  }
);
</script>

<template>
  <Header></Header>
  <main>
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
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
/* Izquierda */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.5s ease;
}
.slide-left-enter {
  transform: translateX(100%);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}

/* Derecha */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s ease;
}
.slide-right-enter {
  transform: translateX(-100%);
}
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
