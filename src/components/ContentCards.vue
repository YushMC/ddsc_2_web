<template>
  <div class="container_cards">
    <h2>Traducciones Recientes</h2>
    <div class="container_options">
      <div class="filtros">
        <a href="">Recientes</a>
      </div>

      <div class="visualizar">
        <a href="">Cuadricula</a>
      </div>
    </div>
    <div v-if="loading">Cargando...</div>
    <div class="space_cards">
      <div class="card" v-for="mod in mods" :key="mod.id">
        <img src="" alt="" />
        <h3>{{ mod.nombre }}</h3>
        <div class="banner_img">
          <img :src="mod.url_img" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

//variables
const mods = ref([]);
const loading = ref(false);
const error = ref("");

const fetchMods = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await fetch(
      "https://www.dokidokispanish.club/api_ddsc/mods/translated-mods-recent"
    );
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const jsonData = await response.json();

    // Acceder a los datos dentro de `results`
    mods.value = jsonData.results || [];
  } catch (err) {
    error.value = err.mesage;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMods);
</script>

<style scoped>
.container_cards {
  max-width: 1000px;
  width: 100%;
  margin: 1% auto;

  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  padding-left: 4%;
  padding-bottom: 4%;
  padding-right: 4%;
  border-radius: 5px;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  border-top-width: 0.5rem;
  border-top-style: solid;
  border-top-color: #e726ee;
  box-sizing: border-box;
}
.container_cards h2:first-child {
  text-align: center;
  background: #e726ee;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  color: #fff;
}
.container_options {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 2% 0;
}
.space_cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 5%;
}
.card {
  width: 100%;
  background: #ffff;
  display: grid;
  grid-template-rows: 1fr 2fr 3fr 1fr;
  align-items: center;
}
.card h3 {
  font-weight: 300;
  text-align: center;
}
.banner_img {
  width: 100%;
  margin: 2% 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.banner_img img {
  width: 90%;
  aspect-ratio: 16/9;
  object-fit: cover;
}
</style>
