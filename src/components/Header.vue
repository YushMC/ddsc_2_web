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
    <div
      style="
        background: tomato;
        width: 100%;
        text-align: center;
        padding: 0.1rem;
      "
    >
      <h6><i class="bi bi-tools"></i> Sitio en construcción</h6>
    </div>

    <div class="container_header">
      <router-link class="container_sitio" to="/" style="text-decoration: none">
        <img
          src="https://www.dokidokispanish.club/assets/gui/Logo_DDSC.png"
          alt=""
          style="width: 3rem"
          loading="lazy"
        />
        <h1>Doki Doki Spanish Club</h1>
      </router-link>
      <nav :class="{ active: isMenuResponsive }">
        <!-- 
        <div class="enlaces">
          <a
            href="https://www.dokidokispanish.club/Doki-Doki-Literature-Club"
            target="_blank"
            >DDLC</a
          >
        </div>
        -->
        <div class="enlaces">
          <router-link to="/traducciones" href="">Traducciones</router-link>
        </div>
        <div class="enlaces">
          <router-link to="/mods">Mods</router-link>
        </div>
        <div class="enlaces">
          <router-link to="/cuenta"
            ><span v-if="!isAuthenticated">Cuenta</span
            ><img :src="tokenData.url_logo" alt="" id="logoUser" v-else
          /></router-link>
        </div>
        <!-- 
        <div class="enlaces">
          <a href="">Comunidad</a>
        </div>
         -->
        <div class="container_buttons_header">
          <a href="https://www.dokidokispanish.club/">Sitio clásico</a>
        </div>
        <button @click="toggleSearchBar" id="searchButton">
          <img
            src="../assets/gui/icon_search_white.svg"
            alt=""
            loading="lazy"
          />
        </button>
        <div class="search_bar" :class="{ active: isActiveSearchBar }">
          <div class="container_search_bar">
            <div class="icon_search_ico">
              <img
                src="../assets/gui/icon_search_balck.svg"
                alt=""
                loading="lazy"
              />
            </div>
            <input
              ref="inputRef"
              type="text"
              placeholder="Buscar"
              v-model="searchQuery"
              @input="filterMods"
            />
          </div>
          <ul class="container_results">
            <li
              v-for="mod in filteredMods"
              :key="mod.id"
              v-if="searchQuery.length > 0"
            >
              <router-link :to="`/mod/${mod.slug}`"
                ><img
                  src="../assets/gui/icon_search_balck.svg"
                  alt=""
                  loading="lazy"
                />{{ mod.nombre }}</router-link
              >
            </li>
          </ul>
          <div
            id="cerrar_bar"
            @click="toggleSearchBar"
            v-if="isActiveSearchBar"
          ></div>
        </div>
      </nav>
      <button
        id="buttonMenu"
        @click="toggleMenu"
        v-if="!isMenuResponsive"
        style="font-size: 2rem"
      >
        <i class="bi bi-list"></i>
      </button>
      <div id="cerrarMenu" v-if="isMenuResponsive" @click="toggleMenu"></div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import { useInfoToken } from "../composables/useInfoToken";

const { tokenData, isAuthenticated } = useInfoToken();

import { useHeaderComposable } from "../composables/useHeader";

const { isLoginUser, isMenuResponsive, isActiveSearchBar } =
  useHeaderComposable();

const mods = ref([]);
const url_logo = ref("");
const searchQuery = ref(""); // Consulta de búsqueda
const filteredMods = ref([]); // Resultados filtrados
const inputRef = ref(null);
const error = ref("");
const ruta = ref("");
const noti = ref("");

const toggleMenu = () => {
  isMenuResponsive.value = !isMenuResponsive.value;
};

const toggleSearchBar = async () => {
  isActiveSearchBar.value = !isActiveSearchBar.value;
  searchQuery.value = "";

  if (isActiveSearchBar.value) {
    await nextTick(); // Asegurar que el DOM está actualizado
    setTimeout(() => {
      inputRef.value?.focus();
    }, 50); // Pequeño retraso para asegurar que el input está disponible
  }
};
// Filtrar mods en base al texto de búsqueda
const filterMods = () => {
  const query = searchQuery.value.toLowerCase();
  filteredMods.value = mods.value.filter((mod) =>
    mod.nombre.toLowerCase().includes(query)
  );
};

const fetchNoti = async () => {
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
const fetchMods = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/search-mods/"
    );
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const jsonData = await response.json();
    mods.value = jsonData.results || [];
    filteredMods.value = mods.value; // Inicializa los resultados filtrados
  } catch (err) {
    error.value = err.message || "Error desconocido";
  }
};

watch(isActiveSearchBar, async (newValue) => {
  if (newValue) {
    await nextTick(); // Asegurar que Vue actualiza el DOM
    setTimeout(() => {
      inputRef.value?.focus();
    }, 50); // Pequeño retraso para evitar problemas con el focus
  }
});

// Cargar los mods al montar el componente
onMounted(() => {
  fetchNoti();
  fetchMods();
  if (isAuthenticated.value) {
    url_logo.value = tokenData.value.url_logo;
    isLoginUser.value = true;
  }
});
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  background: var(--color_fondo);
  width: 100%;
  height: 9dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1% 0;
  z-index: 100 !important;
  padding: 0;
  margin: 0;
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.589);
}
.container_header {
  width: 80%;
  margin-inline: auto;
  display: flex;
  justify-content: space-between;
  gap: 5%;
  align-items: center;
}
.container_sitio {
  width: 30%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}
.container_sitio h1 {
  text-align: left;
  font-size: 1rem;
  color: #fff;
}
nav {
  width: 100%;
  display: flex;
  justify-content: space-around;
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
  background: none !important;
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
  text-wrap: nowrap;
}
#buttonMenu {
  display: none;
}
#cerrarMenu {
  display: none;
}
#searchButton {
  background: none;
  border: none;
  cursor: pointer;
}
#logoUser {
  margin-top: 2%;
  width: 2rem;
  border-radius: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
}
.search_bar {
  position: fixed;
  z-index: 80 !important;
  width: 100%;
  height: 10dvh;
  top: 0dvh;
  left: 0;
  padding: 1% 10%;
  background: #a710ac7a;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.5s linear;
  transform: translateY(-300px);
  opacity: 0;
  visibility: hidden;
}
.search_bar.active {
  transform: translate(0px);
  opacity: 1;
  visibility: visible;
}
.search_bar .container_search_bar {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-items: center;
  flex-direction: column;
}
.container_search_bar input {
  border: none;
  width: 100%;
  padding: 1% 2.5rem;
}
.container_results {
  position: fixed;
  top: 10dvh;
  left: 10%;
  width: 80%;
  background: #fff;
  list-style: none;
  display: flex;
  flex-direction: column;
  z-index: 90;
}
.container_results li {
  position: relative;
  width: 100%;
  height: 5dvh !important;
  border: solid 2px transparent;
  border-bottom: #00000056 solid 1px;
  opacity: 0.8;
  transition: all 0.3s linear;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_results li:hover {
  opacity: 1;
  background: #00000017;
}
.container_results li a {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 2% 1%;
  align-items: center;
  text-decoration: none;
  gap: 1rem;
  color: #000;
  background: none;
}
.icon_search_ico {
  display: none;
  position: relative;
  top: 15%;
  left: 0.5rem;
  width: 1.5rem;
}
.icon_search_ico img {
  width: 100%;
}
#cerrar_bar {
  position: fixed;
  top: 10dvh;
  width: 100%;
  height: 100dvh;
  background: #00000059;
  backdrop-filter: blur(5px);
  z-index: 70 !important;
}
@media screen and (max-width: 900px) {
  #buttonMenu {
    display: block;
  }
  #cerrarMenu {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    z-index: 80;
    background: #0000004d;
  }
  .container_sitio {
    width: 80%;
  }
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 50dvw;
    height: 100dvh;
    background: var(--color_fondo);
    display: flex;
    flex-direction: column;
    z-index: 100;
    backdrop-filter: blur(10px);
    box-shadow: 0px 0px 60px 10px rgba(0, 0, 0, 0.589);
    transform: translatex(-500px);
    transition: all 0.3s ease-in-out;
  }
  nav.active {
    transform: translateX(0px);
  }

  .container_buttons_header {
    width: 100%;
  }
  .search_bar {
    width: 100vw;
    top: 0%;
    background: var(--color_fondo);
  }
  .search_bar input {
    padding-left: 1.6rem !important;
  }
  #cerrar_bar {
    background: var(--color_fondo_transparente);
    backdrop-filter: blur(30px) !important;
  }
}

a {
  background: none !important;
}
</style>
