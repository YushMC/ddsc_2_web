<template>
  <div class="estructura">
    <div class="content_info">
      <img
        src="https://www.dokidokispanish.club/assets/gui/banner_mods.jpg"
        alt=""
        loading="lazy"
      />
      <div class="content_text">
        <h1>Mods de la comunidad</h1>
        <p>
          Bienvenido a nuestra nueva sección de mods!<br /><br />
          Ahora con filtros de busqueda y modos de visualización en la misma
          página! <br /><br />
          Actualizamos de manera constante!
        </p>
      </div>
    </div>
    <ContentCards :solicitud="6"></ContentCards>
  </div>
</template>

<script setup>
document.title = "Mods - Doki Doki Spanish Club";
import ContentCards from "../components/ContentCards.vue";
import { onMounted } from "vue";
import { useHeaderComposable } from "../composables/useHeader";
const { isMenuResponsive } = useHeaderComposable();

onMounted(() => {
  isMenuResponsive.value = false;
});
</script>

<style scoped>
.filtros {
  width: 80%;
  margin: auto;
  background: rgba(255, 255, 255, 0.644);
}
</style>
