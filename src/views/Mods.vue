<template>
  <div class="estructura">
    <ContentCards :solicitud="6"></ContentCards>
  </div>
</template>

<script setup>
import ContentCards from "../components/ContentCards.vue";
</script>

<style scoped>
.content_info {
  width: 80%;
  margin: auto;
  background: rgba(255, 255, 255, 0.644);
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

.filtros {
  width: 80%;
  margin: auto;
  background: rgba(255, 255, 255, 0.644);
}
</style>
