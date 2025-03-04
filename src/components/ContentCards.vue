<template>
  <div class="container_cards">
    <h2>{{ seccion_titulo }} ({{ totalData }})</h2>
    <div class="container_options">
      <div class="visualizar">
        <button @click="toggleViews" id="toggleView" v-if="isAuthenticated">
          <img
            v-if="!isActive"
            src="../assets/gui/list_icon.svg"
            alt=""
            loading="lazy"
          />
          <img src="../assets/gui/grid_icon.svg" alt="" v-else loading="lazy" />
        </button>
        <div class="pagination">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Anterior
          </button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Siguiente
          </button>
          <input
            type="number"
            v-model="inputPage"
            @keyup.enter="goToPage"
            :min="1"
            :max="totalPages"
            placeholder="Ir a página"
            v-if="isAuthenticated"
          />
          <select
            v-model="itemsPerPage"
            @change="resetToFirstPage"
            v-if="isAuthenticated"
          >
            <option :value="5">5 por página</option>
            <option :value="10">10 por página</option>
            <option :value="15">15 por página</option>
            <option :value="20">20 por página</option>
            <option :value="50">50 por página</option>
          </select>
        </div>
      </div>
    </div>

    <transition name="blur" mode="out-in">
      <div v-if="loading" :class="isActive ? 'space_cards_2' : 'space_cards'">
        <div class="card" v-for="mod in paginatedItems" :key="mod.id">
          <h3 class="nombre_mod">{{ mod.nombre }}</h3>
          <div class="banner_img">
            <Swiper
              v-if="mod.capturas.length !== 0 || mod?.portada.trim() !== ''"
              :modules="[Pagination, Navigation]"
              pagination
              class="mySwiper"
              :space-between="10"
              :navigation="true"
            >
              <swiper-slide v-if="mod?.portada.trim() !== ''">
                <img :src="mod.portada" alt="" loading="lazy" />
              </swiper-slide>
              <swiper-slide v-else>
                <img
                  src="https://api.dokidokispanish.club/gui/Imagen-no-disponible.jpg"
                  alt=""
                  loading="lazy"
                />
              </swiper-slide>
              <swiper-slide
                v-for="(url, index) in mod.capturas"
                :key="index"
                v-if="mod.capturas.length !== 0"
              >
                <img :src="url" alt="Imagen del mod" loading="lazy" />
              </swiper-slide>
            </Swiper>
            <div class="container_img_logo">
              <img :src="mod.logo" alt="" loading="lazy" />
            </div>
          </div>
          <div class="descripcion">
            <h3><b>Géneros:</b></h3>
            <span v-for="(genero, index) in mod.generos" :key="index"
              >{{ genero }}
            </span>
            <h3><b>Duración:</b> {{ mod.duracion }}</h3>
            <h3><b>Estado:</b> {{ mod.estado }}</h3>
          </div>
          <div class="botones_info">
            <router-link :to="{ path: `/mod/${mod.slug}` }">Info</router-link>
          </div>
        </div>
      </div>
      <div v-else>
        <Loader></Loader>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

import Loader from "./Loader.vue";

import { useInfoToken } from "../composables/useInfoToken";
const { isAuthenticated } = useInfoToken();

const props = defineProps({
  solicitud: { type: Number, required: true },
});

const isLoadedImage = ref(false);
const handleLoad = () => {
  isLoadedImage.value = true;
};
const mods = ref([]);
const loading = ref(false);
const error = ref("");
const ruta = ref("");
const isActive = ref(false);
const seleccion_ruta = ref(props.solicitud);
const seccion_titulo = ref("");

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(10);
const inputPage = ref("");

const totalData = computed(() => mods.value.length);
const totalPages = computed(
  () => Math.ceil(mods.value.length / itemsPerPage.value) || 1
);

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return mods.value.slice(start, end);
});

// Cambiar página
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const goToPage = () => {
  const page = parseInt(inputPage.value, 10);
  if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
  inputPage.value = "";
};

const toggleViews = () => {
  isActive.value = !isActive.value;
};

// Obtener los mods de la API
const fetchMods = async () => {
  error.value = "";

  switch (seleccion_ruta.value) {
    case 1:
      seccion_titulo.value = "Traducciones Recientes";
      ruta.value =
        "https://api.dokidokispanish.club/mods/translated-mods-recents";
      break;
    case 2:
      seccion_titulo.value = "Mods Recientes";
      ruta.value =
        "https://api.dokidokispanish.club/mods/community-mods-recents";
      break;
    case 3:
      seccion_titulo.value = "Mods Más Visitados";
      ruta.value = "https://api.dokidokispanish.club/mods/most-watched-mods";
      break;
    case 4:
      seccion_titulo.value = "Selección de la Comunidad";
      ruta.value = "https://api.dokidokispanish.club/mods/selection";
      break;
    case 5:
      seccion_titulo.value = "Traducciones";
      ruta.value = "https://api.dokidokispanish.club/mods/translated-mods";
      break;
    case 6:
      seccion_titulo.value = "Mods de la comunidad";
      ruta.value = "https://api.dokidokispanish.club/mods/community-mods";
      break;
  }

  try {
    const response = await fetch(ruta.value);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
      return false;
    }
    const jsonData = await response.json();
    mods.value = jsonData.results || [];
    return true;
  } catch (err) {
    error.value = err.message || "Error desconocido";
    return false;
  }
};

onMounted(async () => {
  const response = await fetchMods();
  if (response) {
    loading.value = true;
    console.log(loading.value);
  } else {
    loading.value = false;
    console.log(loading.value);
  }
});
</script>

<style scoped>
.container_cards {
  width: 80%;
  margin: 1% auto;
  height: fit-content !important;
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
  border-top-color: var(--color_fondo);
  box-sizing: border-box;
  user-select: none !important;
  content-visibility: auto;
}
.container_cards h2:first-child {
  /* position: sticky;
  top: 100px;
  */
  position: relative;

  text-align: center;
  background: var(--color_fondo);
  box-shadow: 0px 0px 50px 5px rgba(8, 8, 8, 0.39);
  border-radius: 5px;
  color: #fff;
  z-index: 90;
}
.container_options {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2% 0;
}
.space_cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 5%;
  transition: all 0.3s linear;
}
.space_cards_2 {
  display: flex;
  flex-direction: column;
  transition: all 0.3s linear;
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
.space_cards_2 .card .isSeleccion {
  display: none;
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
  transform: scale(1.03);
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
    var(--color_fondo),
    #2196f3be,
    var(--color_fondo) 00
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
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_img_logo {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 80;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
  border-radius: 10px;
  transition: all 0.3s linear;
}
.banner_img:hover .container_img_logo {
  transform: translateY(-80px) scale(0.5);
  opacity: 0;
  visibility: hidden;
  background: none !important;
}
.container_img_logo img {
  width: 7rem !important;
  aspect-ratio: 1/1 !important;
  object-fit: contain !important;
}
.space_cards_2 .banner_img .swiper {
  width: 200px;
}

.banner_img .swiper {
  transition: all 0.3s linear;
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
  font-size: 1.1rem;
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
  background: var(--color_fondo);
  color: #fff;
  text-decoration: none;
}
.container_options .visualizar button {
  background: var(--color_fondo) !important;
  color: #fff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.visualizar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.visualizar .pagination {
  width: 40dvw;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.visualizar .pagination button {
  border-radius: 10px;
  border: 2px solid var(--color_fondo);
  padding: 1%;
  background: none;
}
.visualizar .pagination input[type="number"] {
  width: 30%;
}

/* Animación de transición cuando cambia el estado */
.blur-enter-active,
.blur-leave-active {
  transition: filter 0.5s ease;
}

.container_options .filtros_busqueda {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
@keyframes move {
  from {
    --a: 0deg;
  }
  to {
    --a: 360deg;
  }
}
#toggleView {
  border: 2px solid var(--color_fondo);
  background: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5%;
  border-radius: 10px;
}
#toggleView img {
  width: 2rem;
}
.pc_link {
  background: rgb(0, 45, 128) !important;
}
.apk_link {
  background: #0ae203 !important;
}
@property --a {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0deg;
}
</style>
