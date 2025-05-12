<template>
  <div class="container_cards" v-if="loading">
    <h2>{{ seccion_titulo }} ({{ modsFiltrados.length }})</h2>
    <div class="visualizar" v-if="props.solicitud !== 7">
      <div class="container_options">
        <button @click="toggleViews" id="toggleView">
          <img
            v-if="!isActive"
            src="../assets/gui/list_icon.svg"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <img src="../assets/gui/grid_icon.svg" alt="" v-else loading="lazy" />
        </button>
      </div>
      <div class="pagination" v-if="props.solicitud !== 7">
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
    <details v-if="isAuthenticated && props.solicitud !== 7">
      <summary>Opciones de filtrado:</summary>
      <div class="container_filters">
        <h3>Filtrar por:</h3>
        <!-- Filtros por Género -->
        <details>
          <summary>Generos:</summary>
          <div class="filters">
            <button
              v-for="genero in listaGeneros"
              :key="genero"
              :class="{ activo: filtros.generos.includes(genero) }"
              @click="toggleFiltro('generos', genero)"
            >
              {{ genero }}
            </button>
          </div>
        </details>

        <details>
          <summary>Duración:</summary>
          <div class="filters">
            <button
              v-for="duracion in listaDuracion"
              :key="duracion"
              :class="{ activo: filtros.duracion.includes(duracion) }"
              @click="toggleFiltro('duracion', duracion)"
            >
              {{ duracion }}
            </button>
          </div>
        </details>

        <details>
          <summary>Enfoque:</summary>
          <div class="filters">
            <button
              v-for="enfoque in listaEnfoque"
              :key="enfoque"
              :class="{ activo: filtros.enfoque.includes(enfoque) }"
              @click="toggleFiltro('enfoque', enfoque)"
            >
              {{ enfoque }}
            </button>
          </div>
        </details>

        <details>
          <summary>Estado:</summary>
          <div class="filters">
            <button
              v-for="estado in listaEstado"
              :key="estado"
              :class="{ activo: filtros.estado.includes(estado) }"
              @click="toggleFiltro('estado', estado)"
            >
              {{ estado }}
            </button>
          </div>
        </details>
      </div>
    </details>
    <transition name="blur" mode="out-in">
      <div :class="isActive ? 'space_cards_2' : 'space_cards'">
        <div
          class="card"
          v-for="mod in paginatedItems"
          :key="mod.id"
          v-if="modsFiltrados.length > 0"
        >
          <h3 class="nombre_mod">{{ mod.nombre }}</h3>
          <div class="banner_img">
            <Swiper
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
                  decoding="async"
                />
              </swiper-slide>
              <swiper-slide
                v-for="(url, index) in mod.capturas"
                :key="index"
                v-if="mod.capturas.length !== 0"
              >
                <img
                  :src="url"
                  alt="Imagen del mod"
                  loading="lazy"
                  decoding="async"
                />
              </swiper-slide>
            </Swiper>
            <div class="container_img_logo">
              <img
                v-if="mod.logo !== null"
                :src="mod.logo"
                alt="Logo del mod"
                loading="lazy"
              />
              <img
                src="https://api.dokidokispanish.club/gui/window_icon.png"
                alt="Logo base"
                loading="lazy"
                v-else
              />
            </div>
          </div>
          <div class="descripcion">
            <h3><b>Géneros:</b></h3>
            <span v-for="(genero, index) in mod.generos" :key="index"
              >{{ genero }}
            </span>
            <h3><b>Duración:</b> {{ mod.duracion }}</h3>
            <h3><b>Estado:</b> {{ mod.estado }}</h3>
            <h3 v-if="props.solicitud == 7"><b>Tipo: </b>{{ mod.tipo }}</h3>
          </div>
          <div class="botones_info">
            <router-link :to="{ path: `/mod/${mod.slug}` }"
              ><i class="bi bi-three-dots-vertical"></i> Info</router-link
            >
          </div>
        </div>
        <div v-else>
          <h3 style="color: red; text-align: center; font-size: 3rem">
            Sin datos :/
          </h3>
        </div>
      </div>
    </transition>
  </div>
  <div v-else>
    <Loader></Loader>
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

const listaGeneros = ref();
const listaDuracion = ref();
const listaEnfoque = ref();
const listaEstado = ref();

const fetchGeneros = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/mods/options/genere",
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const data = await response.json();

      listaGeneros.value = data.results.map((item) => item.genero);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const fetchDuracion = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/mods/options/duration",
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const data = await response.json();

      listaDuracion.value = data.results.map((item) => item.duracion);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const fetchEnfoque = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/mods/options/focus-on",
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const data = await response.json();

      listaEnfoque.value = data.results.map((item) => item.enfoque);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const fetchEstado = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/mods/options/status",
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const data = await response.json();

      listaEstado.value = data.results.map((item) => item.estado);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const filtros = ref({
  generos: [],
  duracion: [],
  enfoque: [],
  estado: [],
});

// Alternar filtros
const toggleFiltro = (categoria, valor) => {
  if (categoria === "generos") {
    // Los géneros pueden tener múltiples valores seleccionados
    const index = filtros.value[categoria].indexOf(valor);
    if (index === -1) {
      filtros.value[categoria].push(valor);
    } else {
      filtros.value[categoria].splice(index, 1);
    }
  } else {
    // Para las demás categorías (duración, enfoque, estado), se permite un solo valor
    if (filtros.value[categoria].includes(valor)) {
      // Si la opción ya está seleccionada, la eliminamos
      filtros.value[categoria] = [];
    } else {
      // Si no está seleccionada, la agregamos
      filtros.value[categoria] = [valor];
    }
  }
};

const modsFiltrados = computed(() => {
  return mods.value.filter((mod) => {
    // Filtrar por géneros (asegurándonos de que el mod tenga todos los géneros seleccionados)
    if (
      filtros.value.generos.length > 0 &&
      !filtros.value.generos.every((filtro) => mod.generos.includes(filtro))
    )
      return false;

    // Filtrar por duración
    if (
      filtros.value.duracion.length > 0 &&
      !filtros.value.duracion.includes(mod.duracion)
    )
      return false;

    // Filtrar por enfoque
    if (
      filtros.value.enfoque.length > 0 &&
      !filtros.value.enfoque.includes(mod.personaje)
    )
      return false;

    // Filtrar por estado
    if (
      filtros.value.estado.length > 0 &&
      !filtros.value.estado.includes(mod.estado)
    )
      return false;

    return true;
  });
});

const totalPages = computed(
  () => Math.ceil(modsFiltrados.value.length / itemsPerPage.value) || 1
);

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return modsFiltrados.value.slice(start, end);
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

const resetToFirstPage = () => {
  currentPage.value = 1;
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
    case 7:
      seccion_titulo.value = "Mods Recientes";
      ruta.value = "https://api.dokidokispanish.club/mods/mods-recents";
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
  await fetchGeneros();
  await fetchDuracion();
  await fetchEstado();
  await fetchEnfoque();
  const response = await fetchMods();
  if (response) {
    loading.value = true;
  } else {
    loading.value = false;
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
  position: relative;
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
  width: fit-content;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  overflow: hidden;
  font-weight: 600;
  text-align: center;
  width: 90%;
  text-overflow: ellipsis !important;
  text-wrap: nowrap;
  white-space: nowrap;
  display: flex;
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

.pagination button {
  background: var(--color_fondo) !important;
  color: #fff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.visualizar {
  width: 100%;
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.visualizar .pagination {
  width: 50rem;
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
  padding: 0.2rem;
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

.container_filters {
  position: sticky;
  width: 100%;
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  top: 60px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
  padding: 0.5rem;
  border-radius: 10px;
  background: #fffffffd;
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 10px 5px rgba(8, 8, 8, 0.171);
}

details {
  position: sticky;
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
}

summary {
  margin-bottom: 1rem;
}

.container_filters details {
  position: relative !important;
}
.filters {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters button {
  border: 2px solid var(--color_fondo);
  background: none !important;
  color: #000;
}

.filters button.activo {
  background: var(--color_fondo) !important;
  color: #fff;
}
@media screen and (max-width: 800px) {
  #toggleView {
    display: none;
  }
}
</style>
