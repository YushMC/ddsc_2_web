<template>
  <div class="estructura">
    <div class="portada">
      <div class="content_swiper">
        <Swiper
          v-if="getValidImages(mod).length"
          :modules="[Navigation, Pagination, Autoplay]"
          navigation
          pagination
          :loop="true"
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
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const mod = ref({});
const error = ref("");

const props = defineProps({
  id: [String, Number], // Acepta cadenas o números
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
    event.preventDefault(); // Evitar acción predeterminada
  }
};
const fetchModsId = async () => {
  try {
    const response = await fetch(
      `https://www.dokidokispanish.club/api_ddsc/mod/${props.id}`
    );
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const jsonData = await response.json();

    if (!jsonData.results || jsonData.results.length === 0) {
      throw new Error("No se encontraron resultados.");
    }

    mod.value = jsonData.results[0];
  } catch (err) {
    error.value = err.message || "Error desconocido";
  }
};

onMounted(() => {
  fetchModsId();
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
.portada .content_swiper {
  position: relative;
  width: 80%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper {
  width: 50rem;
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
    margin-top: 25%;
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
}
</style>
