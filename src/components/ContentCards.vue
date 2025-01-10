<template>
  <div class="container_cards">
    <h2>{{ seccion_titulo }} ({{ totalData }})</h2>
    <div class="container_options">
      <div class="visualizar">
        <button @click="toggleViews" id="toggleView">
          <img v-if="!isActive" src="../assets/gui/list_icon.svg" alt="" />
          <img src="../assets/gui/grid_icon.svg" alt="" v-else />
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
          />
          <select v-model="itemsPerPage" @change="resetToFirstPage">
            <option :value="5">5 por página</option>
            <option :value="10">10 por página</option>
            <option :value="15">15 por página</option>
            <option :value="20">20 por página</option>
            <option :value="50">50 por página</option>
          </select>
        </div>
      </div>
      <div class="filtros_busqueda" v-if="seleccion_ruta >= 5">
        <h4>Filtros:</h4>
        <select v-model="filters.genero">
          <option value="">Todos los géneros</option>
          <option
            v-for="(option, index) in sortedGeneros"
            :key="index"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <select v-model="filters.estado">
          <option value="">Todos los estados</option>
          <option
            v-for="(option, index) in sortedEstados"
            :key="index"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <select v-model="filters.enfoque">
          <option value="">Todos los enfoques</option>
          <option
            v-for="(option, index) in sortedEnfoques"
            :key="index"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <select v-model="filters.duracion">
          <option value="">Todas las duraciones</option>
          <option
            v-for="(option, index) in sortedDuracion"
            :key="index"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <button @click="resetFilters">Reiniciar Filtros</button>
      </div>
    </div>
    <transition name="blur" mode="out-in">
      <div v-if="!loading" :class="isActive ? 'space_cards_2' : 'space_cards'">
        <div
          class="card"
          v-for="mod in paginatedItems"
          :key="mod.id"
          :class="mod.seleccion ? 'isSeleccion' : ''"
        >
          <h3 class="nombre_mod" :class="{ 'text-gradient': mod.seleccion }">
            {{ mod.nombre }}
          </h3>
          <div class="banner_img">
            <Swiper
              v-if="getValidImages(mod).length"
              :modules="[Pagination]"
              pagination
              class="mySwiper"
              :space-between="10"
            >
              <swiper-slide
                v-for="(url, index) in getValidImages(mod)"
                :key="index"
              >
                <img :src="url" alt="Imagen del mod" />
              </swiper-slide>
            </Swiper>
            <div class="container_img_logo">
              <img :src="mod.url_logo" alt="" />
            </div>
          </div>
          <div class="descripcion">
            <h3 class="text-gradient" v-if="mod.seleccion">
              Selección de la Comunidad
            </h3>
            <h3><b>Género:</b> <br />{{ mod.genero }}</h3>
            <h3><b>Duración:</b> <br />{{ mod.duracion }}</h3>
            <h3><b>Estado:</b> <br />{{ mod.estado }}</h3>
          </div>
          <div class="botones_info">
            <router-link :to="{ path: `/mod/${mod.id}` }">Info</router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

// Props y estado
const props = defineProps({
  solicitud: {
    type: Number,
    required: true,
  },
});
console.log(props.solicitud);

const mods = ref([]);
const loading = ref(false);
const error = ref("");
const ruta = ref("");
const isActive = ref(false);
const seleccion_ruta = ref(0);
const seccion_titulo = ref("");
seleccion_ruta.value = props.solicitud;
const toggleViews = () => {
  isActive.value = !isActive.value;
};
// Paginación
const totalData = computed(() => filteredItems.value.length);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const inputPage = ref("");

const totalPages = computed(() => {
  const totalItems = filteredItems.value.length || 0;
  return Math.ceil(totalItems / itemsPerPage.value) || 1;
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

// Cambiar página
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Ir a la página especificada
const goToPage = () => {
  const page = parseInt(inputPage.value, 10);
  if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
  inputPage.value = "";
};

// Filtros
const filters = ref({
  genero: "",
  estado: "",
  enfoque: "",
  duracion: "",
});

const uniqueGeneros = computed(() => [
  ...new Set(mods.value.map((mod) => mod.genero)),
]);
const uniqueEstados = computed(() => [
  ...new Set(mods.value.map((mod) => mod.estado)),
]);
const uniqueEnfoques = computed(() => [
  ...new Set(mods.value.map((mod) => mod.enfoque)),
]);
const uniqueDuracion = computed(() => [
  ...new Set(mods.value.map((mod) => mod.duracion)),
]);
// Ordenar alfabéticamente los géneros
const sortedGeneros = computed(() => {
  return uniqueGeneros.value.sort((a, b) => a.localeCompare(b));
});

// Ordenar alfabéticamente los géneros
const sortedEstados = computed(() => {
  return uniqueEstados.value.sort((a, b) => a.localeCompare(b));
});

// Ordenar alfabéticamente los géneros
const sortedEnfoques = computed(() => {
  return uniqueEnfoques.value.sort((a, b) => a.localeCompare(b));
});

// Ordenar alfabéticamente los géneros
const sortedDuracion = computed(() => {
  return uniqueDuracion.value.sort((a, b) => a.localeCompare(b));
});
// Filtrado de los mods según los filtros seleccionados
const filteredItems = computed(() => {
  return mods.value.filter((mod) => {
    return (
      (filters.value.genero === "" || mod.genero === filters.value.genero) &&
      (filters.value.estado === "" || mod.estado === filters.value.estado) &&
      (filters.value.enfoque === "" || mod.enfoque === filters.value.enfoque) &&
      (filters.value.duracion === "" || mod.duracion === filters.value.duracion)
    );
  });
});

// Función para reiniciar los filtros
const resetFilters = () => {
  filters.value = {
    genero: "",
    estado: "",
    enfoque: "",
    duracion: "",
  };
  currentPage.value = 1; // Reiniciar la página a la 1 al reiniciar los filtros
};

// Obtener imágenes válidas de cada mod
const getValidImages = (mod) => {
  return [mod.url_img, mod.url_img2, mod.url_img3, mod.url_img4].filter(
    (url) => url && url.trim() !== ""
  );
};

// Función para obtener los mods de la API
const fetchMods = async () => {
  loading.value = true;
  error.value = "";

  // Cambiar la URL según la ruta seleccionada
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
    case 5:
      seccion_titulo.value = "Traducciones";
      ruta.value =
        "https://www.dokidokispanish.club/api_ddsc/mods/translated-mods";
      break;
    case 6:
      seccion_titulo.value = "Mods de la comunidad";
      ruta.value =
        "https://www.dokidokispanish.club/api_ddsc/mods/community-mods";
      break;
  }

  try {
    const response = await fetch(ruta.value);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const jsonData = await response.json();
    mods.value = jsonData.results || [];
  } catch (err) {
    error.value = err.message || "Error desconocido";
  } finally {
    loading.value = false;
  }
};

// Cargar los mods al montar el componente
onMounted(() => {
  fetchMods();
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
  border-top-color: #a610ac;
  box-sizing: border-box;
  user-select: none !important;
}
.container_cards h2:first-child {
  /* position: sticky;
  top: 100px;
  */
  position: relative;

  text-align: center;
  background: #a610ac;
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
    #a610ac,
    #2196f3be,
    #a610ac00
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
  background: #a610ac;
  color: #fff;
  text-decoration: none;
}
.container_options .visualizar button {
  background: #a610ac !important;
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
  border: 2px solid #a610ac;
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
  border: 2px solid #a610ac;
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
