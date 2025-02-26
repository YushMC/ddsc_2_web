<template>
  <div
    id="fondo"
    :style="{
      backgroundImage: `url(${user.url_fondo_pantalla})`,
    }"
  >
    <div class="info">
      <img
        v-if="user.url_banner"
        :src="user.url_banner"
        alt=""
        loading="lazy"
        class="banner"
      />
      <img
        v-if="user.url_logo"
        :src="user.url_logo"
        alt=""
        loading="lazy"
        class="logo"
      />

      <h1 v-if="user.nombre" class="nombre_user">{{ user.nombre }}</h1>
      <p>
        {{ user.descripcion }}
      </p>
      <div class="content_redes">
        <a href="" v-if="user.facebook">Facebook</a>
        <a href="" v-if="user.instagram">Instagram</a>
      </div>
      <div class="container_about_mods">
        <h4>Logros:</h4>
        <div class="container_logros">
          <div class="logro">
            <img
              src="https://www.dokidokispanish.club/assets/gui/banner_inicio.jpg"
              alt=""
            />
            <h5>Logro:</h5>
          </div>
          <div class="logro">
            <img
              src="https://www.dokidokispanish.club/assets/gui/banner_inicio.jpg"
              alt=""
            />
            <h5>Logro:</h5>
          </div>
        </div>
        <h4>Mods Terminados</h4>
        <div class="container_mods_terminados">
          <img
            src="https://www.dokidokispanish.club/assets/gui/window_icon.png"
            alt=""
          />
          <img
            src="https://www.dokidokispanish.club/assets/gui/window_icon.png"
            alt=""
          />
          <img
            src="https://www.dokidokispanish.club/assets/gui/window_icon.png"
            alt=""
          />
          <img
            src="https://www.dokidokispanish.club/assets/gui/window_icon.png"
            alt=""
          />
          <img
            src="https://www.dokidokispanish.club/assets/gui/window_icon.png"
            alt=""
          />
          <img
            src="https://www.dokidokispanish.club/assets/gui/window_icon.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();
const user = ref({});
const slug = ref(route.params.slug || ""); // Inicializar con un valor seguro

const fetchUserSlug = async (slug) => {
  if (!slug) return; // Evita llamar a la API si el slug es undefined

  try {
    const response = await fetch(
      `https://api.dokidokispanish.club/user/${slug}`
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const jsonData = await response.json();
    user.value = jsonData.results[0] || {};

    if (user.value.nombre) {
      document.title = `${user.value.nombre} - Doki Doki Spanish Club`;
    }
  } catch (err) {
    console.error("Error al cargar el usuario:", err.message);
  }
};

// Observar cambios en route.params.slug de forma correcta
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      fetchUserSlug(newSlug);
    }
  },
  { immediate: true } // Ejecuta la función al inicio también
);
</script>

<style scoped>
#fondo {
  background-image: url("https://api.dokidokispanish.club/gui/Winter_Neva.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.info {
  margin-top: 13dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(2px);
  background: rgba(49, 49, 49, 0.5);

  min-height: 77dvh;
}
.banner {
  width: 100%;
  max-height: 40dvh;
  aspect-ratio: 16/9;
  object-fit: cover;
  object-position: center;
  border-bottom: solid 4px var(--color_fondo);
  filter: brightness(0.8);
}

.logo {
  width: 15rem;
  margin-inline: auto;
  margin-top: -8rem;
  overflow: hidden;
  position: relative;
  z-index: 60;
  object-fit: cover;
  aspect-ratio: 1/1;
  border-radius: 100%;
  filter: drop-shadow(5px 5px 10px #000000);
  border: solid 3px var(--color_fondo);
  border-bottom: none;
}

.nombre_user {
  width: 100%;
  text-align: center;
  margin-block: 1rem;
  color: #fff;
}
.info p {
  width: 80%;
  margin-inline: auto;
  text-align: center;
  color: #fff;
}
.content_redes {
  margin-top: 2rem;
  width: 80%;
  margin-inline: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.container_about_mods {
  width: 80%;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.548);
  padding: 1rem;
  border-radius: 20px;
}
.container_mods_terminados {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.container_mods_terminados img {
  width: 5rem;
  aspect-ratio: 1/1;
  object-fit: contain;
}
.container_logros {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.container_logros .logro {
  width: 49%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  border: solid 2px var(--color_fondo);
  border-radius: 20px;
}
.logro img {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 20px;
}
.logro h5 {
  text-align: center;
  font-weight: 200 !important;
}
@media screen and (max-width: 800px) {
  .container_logros .logro {
    width: 100%;
  }
}
</style>
