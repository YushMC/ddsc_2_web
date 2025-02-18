<template>
  <div class="estructura">
    <div class="content_info">
      <img
        src="https://www.dokidokispanish.club/assets/gui/banner_inicio.jpg"
        alt=""
        loading="lazy"
      />
      <div class="content_text">
        <h1>DDSCs</h1>
      </div>
    </div>
    <ContentCards :solicitud="1"></ContentCards>
    <ContentCards :solicitud="2"></ContentCards>
    <ContentCards :solicitud="3"></ContentCards>
    <ContentCards :solicitud="4"></ContentCards>
  </div>
</template>

<script setup>
import ContentCards from "../components/ContentCards.vue";
</script>

<style scoped></style>
