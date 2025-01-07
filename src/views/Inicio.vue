<template>
  <div class="estructura">
    <div class="content_info">
      <img
        src="https://www.dokidokispanish.club/assets/gui/banner_inicio.jpg"
        alt=""
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

<style scoped>
.content_info {
  width: 80%;
  margin: auto;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 2%;
  margin-bottom: 2%;
}
.content_info img {
  width: 100%;
  margin: 2%;
  border-radius: 5px;
  aspect-ratio: 16/9;
  object-fit: cover;
}
</style>
