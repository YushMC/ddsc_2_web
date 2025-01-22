<template>
  <div class="estructura">
    <div class="content_info">
      <img
        src="https://www.dokidokispanish.club/assets/gui/banner_traduccion.jpg"
        alt=""
      />
      <div class="content_text">
        <h1>Traducciones</h1>
        <p>
          Bienvenido a nuestra nueva sección de traducciones!<br /><br />
          Ahora con filtros de busqueda y modos de visualización en la misma
          página! <br /><br />
          Actualizamos de manera constante!
        </p>
      </div>
    </div>
    <ContentCards :solicitud="5"></ContentCards>
  </div>
</template>

<script setup>
document.title = "Traducciones - Doki Doki Spanish Club";
import ContentCards from "../components/ContentCards.vue";
</script>

<style scoped>
.filtros {
  width: 80%;
  margin: auto;
  background: rgba(255, 255, 255, 0.644);
}
</style>
