<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Header></Header>
  <main>
    <div class="content_info">
      <img
        src="https://www.dokidokispanish.club/assets/gui/banner_inicio.jpg"
        alt=""
      />
      <div class="content_text">
        <h1>DDSCs</h1>
      </div>
    </div>
    <Footer></Footer>
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  position: relative;
  padding-top: 7%;
  background: url(./assets/gui/Azur_Lane.png);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
}
.content_info {
  max-width: 1000px;
  width: 100%;
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
