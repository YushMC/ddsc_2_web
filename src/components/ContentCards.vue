<template>
  <div class="container_cards">
    <h2>{{ seccion_titulo }}</h2>
    <div class="container_options">
      <div class="visualizar">
        <button @click="toggleViews">Cambiar presentación</button>
      </div>
    </div>
    <div v-if="loading">Cargando...</div>
    <transition name="blur-transition">
      <div :class="isActive ? 'space_cards_2' : 'space_cards'">
        <div
          class="card"
          v-for="mod in mods"
          :key="mod.id"
          :class="mod.seleccion ? 'isSeleccion' : ''"
        >
          <h3 class="nombre_mod">{{ mod.nombre }}</h3>
          <div class="banner_img">
            <Swiper
              v-if="getValidImages(mod).length"
              :modules="[Navigation, Pagination]"
              navigation
              pagination
              class="mySwiper"
              :space-between="10"
            >
              <!-- Generar dinámicamente los slides con v-for -->
              <swiper-slide
                v-for="(url, index) in getValidImages(mod)"
                :key="index"
              >
                <img :src="url" alt="Imagen del mod" />
              </swiper-slide>
            </Swiper>
          </div>
          <div class="descripcion">
            <h3><b>Genero:</b> {{ mod.genero }}</h3>
            <h3><b>Duración:</b> {{ mod.duracion }}</h3>
            <h3><b>Estado:</b> {{ mod.estado }}</h3>
          </div>
          <div class="botones_info">
            <a :href="mod.link_pc" target="_blank">PC</a>
            <a :href="mod.link_android" target="_blank">Android</a>
            <a :href="mod.id">Info</a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  solicitud: {
    type: Number,
    required: true,
  },
});
console.log(props.solicitud);
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue"; // Componentes de Swiper
import "swiper/css"; // Estilos básicos
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules"; // Módulos de Swiper

//variables
const mods = ref([]);
const loading = ref(false);
const error = ref("");
const ruta = ref("");
const isActive = ref(false);
const seleccion_ruta = ref(0);
const seccion_titulo = ref("");
seleccion_ruta.value = props.solicitud;
//swipers

const slides = ref([]); // Arreglo para los slides

const toggleViews = () => {
  isActive.value = !isActive.value;
};

// Computar las imágenes válidas de los mods
const getValidImages = (mod) => {
  return [mod.url_img, mod.url_img2, mod.url_img3, mod.url_img4].filter(
    (url) => url && url.trim() !== ""
  );
};

// Función para obtener los mods de la API
const fetchMods = async () => {
  loading.value = true;
  error.value = "";

  switch (seleccion_ruta.value) {
    case 1:
      seccion_titulo.value = "Traducciones Recientes";
      ruta.value =
        "https://www.dokidokispanish.club/api_ddsc/mods/translated-mods-recent";
      break;
    case 2:
      seccion_titulo.value = "Mods Recientes";
      ruta.value =
        "https://www.dokidokispanish.club/api_ddsc/mods/get-mods-recent";
      break;
    case 3:
      seccion_titulo.value = "Mods Más Visitados";
      ruta.value =
        "https://www.dokidokispanish.club/api_ddsc/mods/most-downloaded-mods";
      break;
    case 4:
      seccion_titulo.value = "Selección de la Comunidad";
      ruta.value = "https://www.dokidokispanish.club/api_ddsc/mods/selection";
      break;
  }
  try {
    const response = await fetch(ruta.value);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const jsonData = await response.json();

    // Acceder a los datos dentro de `results`
    mods.value = jsonData.results || [];
  } catch (err) {
    error.value = err.message || "Error desconocido";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMods();
});
</script>

<style scoped>
.container_cards {
  width: 80%;
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
  position: sticky;
  top: 100px;
  text-align: center;
  background: #e726ee;
  box-shadow: 0px 0px 50px 5px rgba(8, 8, 8, 0.39);
  border-radius: 5px;
  color: #fff;
  z-index: 90;
}
.container_options {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 2% 0;
}
.space_cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 5%;
}
.space_cards_2 {
  display: flex;
  flex-direction: column;
}

.space_cards_2 .card {
  margin-top: 5%;
  height: 200px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 0;
  align-items: center;
}

.card {
  width: 100%;
  height: 500px;
  background: #ffff;
  align-items: center;
  border-radius: 10px;
  padding: 4%;
  transition: all 0.3s linear;
}
.card:hover {
  transform: translateX(10px) translateY(-10px);
}
.space_cards .card {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}
.space_cards .card .swiper {
  width: 200px !important;
}
.card .nombre_mod {
  font-weight: 600;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.isSeleccion {
  border: 10px solid transparent;
  border-image-source: conic-gradient(
    from var(--a),
    #e726ee,
    #e726eebe,
    #e726ee00
  );
  border-image-slice: 1 1 1 1;
  border-image-width: 0.25rem;
  animation: move 3s infinite linear;
}
.container_logo {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_logo img {
  aspect-ratio: 1/1;
  object-fit: cover;
  width: 100%;
  filter: drop-shadow(2px 5px 10px #000000);
}
.banner_img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.space_cards_2 .banner_img .swiper {
  width: 200px;
}

.banner_img .swiper {
  transition: all 0.3s linear;
}
.banner_img:hover .swiper {
  transform: scale(1.5);
  position: relative;
  z-index: 90;
  filter: drop-shadow(0px 5px 50px #000000);
}
.banner_img img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 10px;
}
.descripcion {
  margin: 0;
  display: flex;
  flex-direction: column;
}
.descripcion h3 {
  font-weight: 350;
  font-size: 1rem;
}

.botones_info {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 80%;
  gap: 1rem;
}
.botones_info a {
  width: 100%;
  text-align: center;
  padding: 2%;
  border-radius: 10px;
  background: #e726ee;
  color: #fff;
  text-decoration: none;
}

/* Animación de transición cuando cambia el estado */
.blur-transition-enter-active,
.blur-transition-leave-active {
  transition: filter 0.5s ease;
}
@keyframes move {
  from {
    --a: 0deg;
  }
  to {
    --a: 360deg;
  }
}

@property --a {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0deg;
}
</style>
