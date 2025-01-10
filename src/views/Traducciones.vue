<template>
  <div class="estructura">
    <div class="content_info">
      <img
        src="https://www.dokidokispanish.club/assets/gui/banner_traduccion.jpg"
        alt=""
      />
      <div class="content_text">
        <h1>DDSCs</h1>
      </div>
    </div>
    <ContentCards :solicitud="5"></ContentCards>
  </div>
</template>

<script setup>
import ContentCards from "../components/ContentCards.vue";
</script>

<style scoped>
.filtros {
  width: 80%;
  margin: auto;
  background: rgba(255, 255, 255, 0.644);
}
</style>
