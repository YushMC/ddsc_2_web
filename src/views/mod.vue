<template>
  <div class="estructura">
    <div class="portada">
      <div class="content_swiper">
        <Swiper
          v-if="getValidImages(mod).length"
          :modules="[Navigation, Pagination, Autoplay, FreeMode, Thumbs]"
          navigation
          pagination
          :thumbs="{ swiper: thumbsSwiper }"
          :loop="getValidImages(mod).length > 1"
          class="mySwiper2"
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
        <Swiper
          @swiper="setThumbsSwiper"
          :spaceBetween="10"
          :slidesPerView="4"
          :freeMode="true"
          :watchSlidesProgress="true"
          class="mySwiper"
        >
          <swiper-slide
            v-for="(url, index) in getValidImages(mod)"
            :key="index"
          >
            <img :src="url" alt="Imagen del mod" class="thumb_img" />
          </swiper-slide>
        </Swiper>
      </div>
      <div class="content_info">
        <div class="content_logo">
          <h1>{{ mod.nombre }}</h1>
          <img :src="mod.url_logo" alt="" />
        </div>
        <p>{{ mod.descripcion }}</p>
        <div class="enlaces">
          <a
            :href="mod.link_pc"
            :class="{ enlace_desactivado: islinkPcDisable }"
            @click="preventAction(islinkPcDisable)"
            target="_blank"
            >Descargar para PC</a
          >
          <a
            :href="mod.link_android"
            :class="{ enlace_desactivado: islinkAndroidDisable }"
            @click="preventAction(islinkAndroidDisable)"
            target="_blank"
            >Descargar para Android</a
          >
        </div>
        <div class="otros_datos">
          <div>
            <h4><b>Generos: </b><br />{{ mod.genero }}</h4>
          </div>
          <div>
            <h4><b>Duración: </b><br />{{ mod.duracion }}</h4>
          </div>
          <div>
            <h4><b>Estado: </b><br />{{ mod.estado }}</h4>
          </div>
          <div v-if="mod.traductor && mod.traductor !== ''">
            <h4><b>Traducido por: </b><br />{{ mod.traductor }}</h4>
          </div>
          <div>
            <h4><b>Creado por: </b><br />{{ mod.creador }}</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="relacionados">
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
          768: { slidesPerView: 4, spaceBetween: 20 }, // Tablets
          1024: { slidesPerView: 5, spaceBetween: 25 }, // Pantallas grandes
        }"
      >
        <swiper-slide v-for="relatedMod in filteredItems" :key="relatedMod.id">
          <img :src="relatedMod.url_img" alt="Imagen del mod" />
          <h3 style="text-align: center">{{ relatedMod.nombre }}</h3>
          <h3>Genero: <br />{{ relatedMod.genero }}</h3>
          <h3>Tipo: <br />{{ relatedMod.tipo_mod }}</h3>
          <router-link :to="{ path: `/mod/${relatedMod.id}` }">Ver</router-link>
        </swiper-slide>
      </Swiper>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
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
  () => !mod.value.link_pc || mod.value.link_pc.trim() === ""
);
const islinkAndroidDisable = computed(
  () => !mod.value.link_android || mod.value.link_android.trim() === ""
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
    const response = await fetch(
      `https://www.dokidokispanish.club/api_ddsc/mod/${id}`
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const jsonData = await response.json();
    mod.value = jsonData.results[0] || {};
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
onMounted(() => {
  fetchModsId(route.params.id);
  fetchMods();
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
}

.content_info p {
  line-height: 1.5;
  font-weight: 300;
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
}

.relacionados .swiper {
  width: 80%;
}

.relacionados .swiper-slide {
  width: 10dvw;
  height: fit-content !important;
  border: 2px solid #a610ac;
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
  background: #a610ac;
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
@media screen and (max-width: 550px) {
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
}
</style>
