<template>
  <div class="estructura">
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
          <!-- Generar dinámicamente los slides con v-for -->
          <swiper-slide v-for="(url, index) in mod.capturas" :key="index">
            <img :src="url" alt="Imagen del mod" loading="lazy" />
          </swiper-slide>
        </Swiper>
        <Swiper
          v-if="mod.capturas.length > 1"
          @swiper="setThumbsSwiper"
          :spaceBetween="10"
          :slidesPerView="4"
          :freeMode="true"
          :watchSlidesProgress="true"
          class="mySwiper"
        >
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
          <img :src="mod.logo" alt="" loading="lazy" />
        </div>
        <p>{{ mod.descripcion }}</p>
        <div class="enlaces">
          <a
            :href="mod.pc"
            :class="{ enlace_desactivado: islinkPcDisable }"
            @click="preventAction(islinkPcDisable)"
            target="_blank"
            >Descargar para PC</a
          >
          <a
            :href="mod.android"
            :class="{ enlace_desactivado: islinkAndroidDisable }"
            @click="preventAction(islinkAndroidDisable)"
            target="_blank"
            >Descargar para Android</a
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

    <div class="relacionados" v-if="filteredItems.length > 1">
      <h2>Mods Relacionados:</h2>
      <Swiper
        v-if="filteredItems.length"
        :modules="[Navigation, Pagination]"
        navigation
        pagination
        class="mySwiper"
        :breakpoints="{
          320: { slidesPerView: 1, spaceBetween: 10 }, // Teléfonos pequeños
          640: { slidesPerView: 3, spaceBetween: 15 }, // Teléfonos más grandes
          768: { slidesPerView: 4, spaceBetween: 20 }, // Pantallas grandes
        }"
      >
        <swiper-slide v-for="relatedMod in filteredItems" :key="relatedMod.id">
          <img :src="relatedMod.url_img" alt="Imagen del mod" loading="lazy" />
          <h3 style="text-align: center">{{ relatedMod.nombre }}</h3>
          <h3>Genero: <br />{{ relatedMod.genero }}</h3>
          <h3>Tipo: <br />{{ relatedMod.tipo_mod }}</h3>
          <router-link :to="{ path: `/mod/${relatedMod.id}` }">Ver</router-link>
        </swiper-slide>
      </Swiper>
    </div>

    <div class="comentarios" v-if="isAuthenticated">
      <h2>Comentarios</h2>

      <form @submit.prevent="agregarComentario">
        <textarea
          v-model="nuevoComentario"
          placeholder="Escribe un comentario"
        ></textarea>
        <button type="submit">Comentar</button>
      </form>
      <div class="paginacion">
        <button @click="pagina--" :disabled="pagina <= 1">Anterior</button>
        <span>Página {{ pagina }} de {{ totalPaginas }}</span>
        <button @click="pagina++" :disabled="pagina >= totalPaginas">
          Siguiente
        </button>
      </div>

      <ul v-if="comentarios.length > 0">
        <ComentarioItem
          v-for="comentario in comentarios"
          :key="comentario.id"
          :comentario="comentario.comentario"
          :logo="comentario.usuario_logo"
          :banner="comentario.usuario_banner"
          :user="comentario.usuario_nombre"
          :id_comentario="comentario.id"
          :id_mod="comentario.id_mod"
          @respuesta="agregarRespuesta"
        />
      </ul>

      <!-- Controles de paginación -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useInfoToken } from "../composables/useInfoToken";
const { isAuthenticated } = useInfoToken();
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

const thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

const route = useRoute();
const mod = ref({});
const mods = ref([]);
const error = ref("");

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
  if (!mod.value || !mods.value.length) return [];
  return mods.value.filter((modFilter) => {
    // Evitar incluir el mod actual
    return (
      modFilter.genero === mod.value.genero &&
      modFilter.enfoque === mod.value.enfoque
    );
  });
});

const fetchModsId = async (id) => {
  try {
    const response = await fetch(`https://api.dokidokispanish.club/mod/${id}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const jsonData = await response.json();
    mod.value = jsonData.results || {};
    console.log(mod.value);
    document.title = mod.value.nombre + " - Doki Doki Spanish Club";
    obtenerComentarios(mod.value.id);
  } catch (err) {
    error.value = err.message || "Error desconocido al cargar el mod.";
  }
};

const fetchMods = async () => {
  try {
    const response = await fetch(
      "https://www.dokidokispanish.club/api_ddsc/mods"
    );
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
  (newId) => {
    if (newId) fetchModsId(newId);
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
      `https://api.dokidokispanish.club/comments/${pagina.value}/5/${id_mod}`
    );
    const data = await res.json();
    comentarios.value = data.comentarios;
    totalPaginas.value = data.total_paginas;
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
    obtenerComentarios();
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

fetchModsId(route.params.id);
fetchMods();
onMounted(async () => {});
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
  height: fit-content !important;
  border: 2px solid var(--color_fondo);
  border-radius: 10px;
  padding: 1%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
}

.relacionados .swiper-slide img {
  aspect-ratio: 1/1;
  width: 100%;
  height: 15dvh;
  object-fit: contain;
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
  content-visibility: auto;
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
  .mySwiper {
    display: none !important;
    height: 50dvh !important;
  }
  .content_info {
    background: none !important;
  }
}
</style>
