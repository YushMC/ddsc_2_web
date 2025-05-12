<template>
  <div class="estructura" v-if="loading">
    <router-link :to="`/cuenta/editar/${mod.slug}`" id="edit" v-if="esPermitido"
      ><i class="bi bi-pencil-fill"></i> Editar</router-link
    >
    <div class="portada">
      <div class="content_swiper">
        <Swiper
          :modules="[Navigation, Pagination, Autoplay, FreeMode, Thumbs]"
          navigation
          pagination
          :thumbs="{ swiper: thumbsSwiper }"
          :loop="getValidImages(mod).length > 1"
          class="mySwiper2"
          :space-between="10"
        >
          <swiper-slide v-if="mod.portada !== ''">
            <img :src="mod.portada" alt="" />
          </swiper-slide>
          <!-- Generar dinámicamente los slides con v-for -->
          <swiper-slide v-for="(url, index) in mod.capturas" :key="index">
            <img :src="url" alt="Imagen del mod" loading="lazy" />
          </swiper-slide>
        </Swiper>
        <Swiper
          @swiper="setThumbsSwiper"
          :spaceBetween="10"
          :slidesPerView="4"
          :freeMode="true"
          :watchSlidesProgress="true"
          class="mySwiper"
        >
          <swiper-slide v-if="mod.portada !== ''">
            <img :src="mod.portada" alt="" loading="lazy" class="thumb_img" />
          </swiper-slide>
          <swiper-slide v-for="(url, index) in mod.capturas" :key="index">
            <img
              :src="url"
              alt="Imagen del mod"
              loading="lazy"
              class="thumb_img"
            />
          </swiper-slide>
        </Swiper>
      </div>
      <div class="content_info" style="background: none !important">
        <div class="content_logo">
          <h1>{{ mod.nombre }}</h1>
          <img
            :src="
              mod.logo && mod.logo !== ''
                ? mod.logo
                : 'https://api.dokidokispanish.club/gui/window_icon.png'
            "
            alt="Logo del mod"
            loading="lazy"
          />
        </div>
        <p>{{ mod.descripcion }}</p>
        <div class="enlaces">
          <a
            :href="mod.pc"
            :class="{ enlace_desactivado: islinkPcDisable }"
            @click="preventAction(islinkPcDisable)"
            target="_blank"
            ><i class="bi bi-download"></i> Descargar para PC</a
          >
          <a
            :href="mod.android"
            :class="{ enlace_desactivado: islinkAndroidDisable }"
            @click="preventAction(islinkAndroidDisable)"
            target="_blank"
            ><i class="bi bi-download"></i> Descargar para Android</a
          >
        </div>
        <div class="otros_datos">
          <div>
            <h4>
              <b>Generos: </b><br /><span
                v-for="(genero, index) in mod.generos"
                :key="index"
                >{{ genero }}
              </span>
              <br />
            </h4>
          </div>
          <div>
            <h4><b>Duración: </b><br />{{ mod.duracion }}</h4>
          </div>
          <div>
            <h4><b>Estado: </b><br />{{ mod.estado }}</h4>
          </div>
          <div v-if="mod.traductores.length > 0">
            <h4>
              <b>Traducido por: </b><br /><span
                v-for="(traductor, index) in mod.traductores"
                :key="index"
                >{{ traductor }}
              </span>
            </h4>
          </div>
          <div v-if="mod.creadores.length > 0">
            <h4>
              <b>Creado por: </b
              ><span v-for="(creador, index) in mod.creadores" :key="index"
                >{{ creador }}
              </span>
            </h4>
          </div>
        </div>
      </div>
    </div>
    <div class="relacionados" v-if="filteredItems.length > 0">
      <h2>Mods Relacionados:</h2>
      <Swiper
        v-if="filteredItems.length"
        :modules="[Navigation, Pagination]"
        navigation
        pagination
        class="mySwiper"
        :breakpoints="{
          800: { slidesPerView: 1, spaceBetween: 10 }, // Teléfonos pequeños
          1200: { slidesPerView: 3, spaceBetween: 10 }, // Teléfonos más grandes
        }"
      >
        <swiper-slide v-for="relatedMod in filteredItems" :key="relatedMod.id">
          <img
            :src="
              relatedMod.portada && relatedMod.portada !== ''
                ? relatedMod.portada
                : 'https://api.dokidokispanish.club/gui/Imagen-no-disponible.jpg'
            "
            alt="Imagen del mod"
            loading="lazy"
          />
          <h3 style="text-align: center">{{ relatedMod.nombre }}</h3>
          <h3>Generos:</h3>
          <div class="container_generos">
            <span v-for="(genero, index) in relatedMod.generos" :key="index"
              >{{ genero }}
            </span>
          </div>
          <h3>
            Tipo: <span style="font-weight: 400">{{ relatedMod.tipo }}</span>
          </h3>
          <router-link :to="{ path: `/mod/${relatedMod.slug}` }"
            ><i class="bi bi-three-dots-vertical"></i> Ver</router-link
          >
        </swiper-slide>
      </Swiper>
    </div>

    <div class="comentarios">
      <h2>Comentarios</h2>

      <form @submit.prevent="agregarComentario">
        <textarea
          v-model="nuevoComentario"
          placeholder="Escribe un comentario"
        ></textarea>
        <button type="submit">Comentar</button>
      </form>
      <!-- 
      <div class="paginacion">
        <button @click="pagina--" :disabled="pagina <= 1">Anterior</button>
        <span>Página {{ pagina }} de {{ totalPaginas }}</span>
        <button @click="pagina++" :disabled="pagina >= totalPaginas">
          Siguiente
        </button>
      </div>
      -->
      <ul v-if="comentarios.length > 0">
        <ComentarioItem
          v-for="comentario in comentarios"
          :key="comentario.id"
          :comentario="comentario"
          :logo="comentario.usuario_logo"
          :banner="comentario.usuario_banner"
          :user="comentario.usuario_nombre"
          :id_comentario="comentario.id"
          :id_mod="comentario.id_mod"
          :slug="comentario.slug"
        />
      </ul>
      <!-- Controles de paginación -->
    </div>
  </div>
  <div v-else id="loader">
    <Loader></Loader>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, onUnmounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useInfoToken } from "../composables/useInfoToken";
const { isAuthenticated, tokenData } = useInfoToken();
import { useHeaderComposable } from "../composables/useHeader";
const { isMenuResponsive, isActiveSearchBar } = useHeaderComposable();
import Swal from "sweetalert2";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  Navigation,
  Pagination,
  Autoplay,
  FreeMode,
  Thumbs,
} from "swiper/modules";
import { useRoute, useRouter } from "vue-router";
import Loader from "../components/Loader.vue";

const thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

const esPermitido = ref(false);

const checkPermisions = () => {
  if (tokenData.value) {
    console.log(tokenData.value);
    if (tokenData.value?.rol == 4 || tokenData.value.rol == 5) {
      esPermitido.value = true;
    }

    if (mod.value.traductores.includes(tokenData.value?.alias)) {
      esPermitido.value = true;
    }

    if (mod.value.creadores.includes(tokenData.value?.alias)) {
      esPermitido.value = true;
    }
  }
};

const route = useRoute();
const mod = ref({});
const mods = ref({});
const error = ref("");
const isLoadComments = ref(false);

const loading = ref(false);

const props = defineProps({
  id: [String, Number],
});

const islinkPcDisable = computed(
  () => !mod.value.pc || mod.value.pc.trim() === ""
);
const islinkAndroidDisable = computed(
  () => !mod.value.android || mod.value.android.trim() === ""
);

const getValidImages = (mod) => {
  if (!mod || typeof mod !== "object") return [];
  return [mod.url_img, mod.url_img2, mod.url_img3, mod.url_img4].filter(
    (url) => url && url.trim() !== ""
  );
};

const preventAction = (isDisabled) => {
  if (isDisabled) {
    event.preventDefault();
  }
};

const filteredItems = computed(() => {
  // Verifica si mod.value y sus propiedades están definidas

  return Object.values(mods.value).filter((modFilter) => {
    const mismoGenero =
      Array.isArray(modFilter.genero) &&
      modFilter.genero.some((genre) => genre === mod.value.genero);
    const mismoEnfoque = modFilter.personaje === mod.value.personaje;

    return (
      modFilter.id !== mod.value.id && // Excluir el mod actual
      (mismoGenero || mismoEnfoque) // Permitir coincidencias por género o enfoque
    );
  });
});

const fetchModsId = async (id) => {
  try {
    const response = await fetch(`https://api.dokidokispanish.club/mod/${id}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const jsonData = await response.json();
    mod.value = jsonData.results || {};
    document.title = mod.value.nombre + " - Doki Doki Spanish Club";
    return true;
  } catch (err) {
    error.value = err.message || "Error desconocido al cargar el mod.";
    return false;
  }
};

const fetchMods = async () => {
  try {
    const response = await fetch("https://api.dokidokispanish.club/mods");
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const jsonData = await response.json();
    mods.value = jsonData.results || [];
  } catch (err) {
    error.value = err.message || "Error desconocido al cargar los mods.";
  }
};
// Detectar cambios en el parámetro de ruta "id"
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      const response = fetchModsId(newId);
      console.log(newId);
      if (response) {
        await obtenerComentarios(newId);
        await fetchMods();
      }
      isActiveSearchBar.value = false;
      isMenuResponsive.value = false;
    }
    window.scrollTo({ top: 0, behavior: "smooth" }); // Desplazar al inicio
  }
);

//comentarios
import ComentarioItem from "../components/cuenta/ComentarioItem.vue";
const comentarios = ref([]);
const nuevoComentario = ref("");
const pagina = ref(1);
const totalPaginas = ref(1);

// Obtener comentarios con paginación
const obtenerComentarios = async (id_mod) => {
  try {
    const res = await fetch(
      `https://api.dokidokispanish.club/comments/${id_mod}`
    );
    if (res.ok) {
      const data = await res.json();
      comentarios.value = data.comentarios;
      isLoadComments.value = true;
    }
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
  }
};

// Agregar un nuevo comentario
const agregarComentario = async () => {
  if (!nuevoComentario.value.trim()) return;

  try {
    Swal.fire({
      title: "Guardando tu comentario",
      allowOutsideClick: false, // Evita el cierre al hacer clic fuera
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await fetch(
      "https://api.dokidokispanish.club/create-comment",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idMod: mod.value.id,
          contenido: nuevoComentario.value,
        }),
      }
    );
    Swal.close();
    const data = await response.json();
    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Ocurrio un error al guardar tu comentario.",
        text: JSON.stringify(data.error),
      });
    }
    Swal.fire({
      title: "Comentario guardado correctamente!",
      text: JSON.stringify(data.message),
      icon: "success",
    });
    nuevoComentario.value = "";
    await obtenerComentarios();
  } catch (error) {
    console.error("Error al agregar comentario:", error);
  }
};

// Cambiar de página
const cambiarPagina = (delta) => {
  pagina.value += delta;
};

// Observar cambios en la página y cargar los comentarios
watch(pagina, obtenerComentarios);

onMounted(async () => {
  isActiveSearchBar.value = false;
  isMenuResponsive.value = false;
  await fetchMods();
  const reponse = await fetchModsId(route.params.id);
  if (reponse) {
    checkPermisions();
    loading.value = true;
    await obtenerComentarios(mod.value.slug);
  } else {
    loading.value = false;
  }

  if (!islinkAndroidDisable && !islinkPcDisable) {
    await Swal.fire({
      icon: "warning",
      title: "No hay links de descarga.",
      text: "No se detectó ningun enlace de descarga disponible, esta página del mod será solo informativa.",
    });
  }
});
onUnmounted(() => {
  comentarios.value = [];
});
</script>

<style scoped>
.portada {
  width: 80%;
  margin: 0% auto;
  margin-bottom: 5%;
  backdrop-filter: blur(10px);
  background: #ffffff5e;
  padding: 1%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 2rem;
  border-radius: 20px;
  overflow: hidden;
}
.relacionados {
  width: 80%;
  margin: 0% auto;
  margin-bottom: 5%;
  background: #ffffff5e;
  padding: 1%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  content-visibility: auto;
}
.portada .content_swiper {
  position: relative;
  width: 80%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.swiper {
  width: 40rem;
  height: 100%;
  margin: auto;
  padding-top: 50px;
  padding-bottom: 50px;
}
.swiper-slide {
  background-position: center;
  background-size: cover;
}
.swiper img {
  display: block;
  width: 100%;
  border-radius: 10px;
}

.content_logo {
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
  align-items: center;
}
.content_logo img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: contain;
}
.portada .content_info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
  background: none !important;
  backdrop-filter: none !important;
}

.content_info p {
  line-height: 1.5;
  font-weight: 500;
  font-size: 1rem !important;
}
.enlaces {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}
.enlaces a {
  width: 100%;
  padding: 2%;
  border-radius: 10px;
  border: solid 2px transparent;
  color: purple;
  text-decoration: none;
}
.enlaces a:first-child {
  border: solid 2px rgb(0, 45, 128);
  background: rgb(0, 45, 128);
  color: rgb(255, 255, 255);
}
.enlaces a:nth-child(2) {
  border: 2px solid #0ae203;
  background: #0ae203;
  color: #ffffff;
}

.otros_datos {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  align-items: center;
}
.otros_datos div {
  display: flex;
  flex-direction: column;
}
.otros_datos div h4 {
  font-weight: 400;
  display: flex;
  flex-direction: column;
}

.relacionados .swiper {
  width: 90%;
}

.relacionados .swiper-slide {
  width: 8dvw;
  height: 450px !important;
  overflow-y: auto;
  overflow-x: hidden;
  border: 2px solid var(--color_fondo);
  border-radius: 10px;
  padding: 1%;
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  align-items: start;
  gap: 1rem;
  overflow: hidden;
}
.container_generos {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.container_generos span {
  padding: 0.5rem;
  border: 2px solid var(--color_fondo);
  border-radius: 10px;
}

.relacionados .swiper-slide img {
  aspect-ratio: 9/16;
  width: 100%;
  height: 20dvh;
  object-fit: cover;
  border-radius: 10px !important;
}
.relacionados .swiper-slide h3 {
  width: 100%;
  font-weight: 600;
  font-size: 1rem;
  text-overflow: ellipsis !important;
  text-wrap: nowrap;
  white-space: nowrap;
  overflow: hidden;
}

.relacionados .swiper-slide a {
  width: 100%;
  padding: 2%;
  background: var(--color_fondo);
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
}
.mySwiper2 {
  height: 80%;
  width: 40rem;
}
.thumb_img {
  cursor: pointer !important;
  filter: brightness(0.5) !important;
  transition: all 0.3s linear !important;
}

.thumb_img:hover {
  filter: brightness(1) !important;
}
.swiper-slide-thumb-active .thumb_img {
  filter: brightness(1) !important;
}

.comentarios {
  width: 80%;
  margin-inline: auto;
  background: #ffffff5e;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1%;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  content-visibility: auto;
  margin-bottom: 2rem;
}
.comentarios form,
.comentarios ul {
  width: 90%;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  list-style: none;
}
.comentarios .paginacion {
  width: 90%;
  margin-inline: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
@media screen and (max-width: 1772px) {
  .portada .content_swiper {
    width: 100%;
    margin: 0;
  }
}
@media screen and (max-width: 1400px) {
  .portada {
    display: flex;
    flex-direction: column;
    padding: 3%;
    margin-top: 4%;
  }
  .content_info p {
    font-size: 0.8rem;
  }
}
@media screen and (max-width: 800px) {
  .portada {
    padding: 2%;
  }
  .content_info {
    overflow: visible;
  }
  .content_logo {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
  }
  .content_swiper {
    width: 100% !important;
  }
  .content_logo h1 {
    width: 100%;
    text-align: center;
    border-radius: 10px;
    font-size: 1.5rem;
  }
  .content_logo img {
    display: none;
  }
  .mySwiper2 {
    width: 20rem !important;
  }
  .portada .mySwiper {
    display: none !important;
    height: 50dvh !important;
  }
  .content_info {
    background: none !important;
  }
  .relacionados .swiper-slide {
    height: fit-content !important;
  }

  .relacionados .swiper-slide img {
    height: 40dvh;
  }
}

#edit {
  position: fixed;
  top: 10dvh;
  left: 2rem;
  z-index: 100;
  background: green !important;
}

#loader {
  width: 100%;
  min-height: 90dvh;
  transform: scale(1.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
