<template>
  <header>
    <!-- 
    <div
      class="notificaciones_header"
      v-for="(item, index) in noti"
      :key="index"
      v-if="!noti.activo"
    >
      <h1>{{ item.title }}</h1>
      <router-link :to="{ path: `/mod/${item.id_mod}` }">Ver Más</router-link>
    </div>
    -->
    <div class="notificaciones_header" style="background: orange">
      <h1>Sitio en construcción y experimental</h1>
    </div>
    <div class="container_header">
      <div class="container_sitio">
        <img src="" alt="" />
        <h1>Doki Doki Spanish Club</h1>
      </div>
      <nav>
        <div class="enlaces">
          <a
            href="https://www.dokidokispanish.club/Doki-Doki-Literature-Club"
            target="_blank"
            >DDLC</a
          >
        </div>
        <div class="enlaces">
          <router-link to="/">Inicio</router-link>
        </div>
        <div class="enlaces">
          <router-link to="/traducciones" href="">Traducciones</router-link>
          <div class="submenu">
            <a href="">Hola</a>
          </div>
        </div>
        <div class="enlaces">
          <router-link to="/mods">Mods</router-link>
        </div>
        <!-- 
        <div class="enlaces">
          <a href="">Comunidad</a>
        </div>
         -->
      </nav>
      <div class="container_buttons_header">
        <a href="https://www.dokidokispanish.club/">Sitio clásico</a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from "vue";

const error = ref("");
const ruta = ref("");
const noti = ref("");

const fetchMods = async () => {
  error.value = "";

  // Cambiar la URL según la ruta seleccionada

  ruta.value = "https://www.dokidokispanish.club/api_ddsc/notifications";

  try {
    const response = await fetch(ruta.value);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const jsonData = await response.json();
    noti.value = jsonData.results || [];
  } catch (err) {
    error.value = err.message || "Error desconocido";
  }
};

// Cargar los mods al montar el componente
onMounted(() => {
  fetchMods();
});
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  background: #a710ac54;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1% 0;
  z-index: 100;
  padding: 0;
  margin: 0;
  backdrop-filter: blur(10px);
}
.notificaciones_header {
  width: 100%;
  background: #a610ac;
  height: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.notificaciones_header h1 {
  font-size: 1.2rem;
  color: #fff;
}
.notificaciones_header a {
  margin: 0.3% 2%;
  border: #fff solid 2px;
  padding: 0.3%;
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
}
.container_header {
  width: 80%;
  height: 50%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  gap: 5%;
  align-items: center;
  padding: 1% 0;
}
.container_sitio {
  width: 30%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container_sitio h1 {
  text-align: left;
  font-size: 1.5rem;
  color: #fff;
}
nav {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2%;
  align-items: center;
}
nav .enlaces {
  width: 100%;
  display: flex;
  flex-direction: column;
}
nav .enlaces a {
  width: 100%;
  text-decoration: none;
  color: #fff;
  font-size: 1rem;
  padding: 2%;
  border-radius: 5px;
  text-align: center;
}
.enlaces .submenu {
  position: absolute;
  top: 90%;
  display: flex;
  flex-direction: column;
  text-wrap: nowrap;
  border-radius: 10px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s linear;
  padding: 1% 2%;
  background: cadetblue;
  z-index: 95 !important;
}
.enlaces:hover .submenu {
  opacity: 1;
  visibility: visible;
}
.submenu::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -20%;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 40px solid cadetblue;
  padding: 2%;
  scale: 0.5;
  z-index: 90 !important;
}
.container_buttons_header {
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_buttons_header a {
  padding: 1% 4%;
  color: #fff;
  text-decoration: none;
  background: #000;
  border-radius: 5px;
}
</style>
