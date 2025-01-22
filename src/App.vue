<script setup>
import { ref, onMounted } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const user_id = ref(0);
const isLoginUser = ref(false);
const userData = ref([]);
const error = ref("");

const opacity = ref(100); // Valor inicial al 100%

const url_fondo = ref("https://www.dokidokispanish.club/assets/gui/Dania.png");

const fetchDataUserId = async (id) => {
  try {
    const response = await fetch(
      `https://www.dokidokispanish.club/api_ddsc/user/${id}`
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const jsonData = await response.json();
    userData.value = jsonData.results[0] || {};
    url_fondo.value = userData.value.url_fondo_pantalla;
  } catch (err) {
    error.value = err.message || "Error desconocido al cargar el mod.";
  }
};

const defaultColor = ref("#a610ac"); // Color predeterminado
const defaultColorTrasnparent = ref("54"); // Color predeterminado
const selectedColor = ref(defaultColor);

function updateColor() {
  setRootColor(selectedColor.value); // Aplica el nuevo color
  localStorage.setItem("myColor", selectedColor.value); // Guarda el color en el localStorage
}

function setRootColor(color) {
  const root = document.documentElement;
  root.style.setProperty("--color_fondo", color);
  root.style.setProperty(
    "--color_fondo_transparente",
    color + defaultColorTrasnparent.value
  );
}

onMounted(() => {
  if (localStorage.getItem("user")) {
    user_id.value = localStorage.getItem("user");
    fetchDataUserId(user_id.value);
    isLoginUser.value = true;
    const storedColor = localStorage.getItem("myColor") || defaultColor.value;
    selectedColor.value = storedColor;
    setRootColor(storedColor); // Aplica el color al :root
  } else {
    const storedColor = defaultColor.value;
    selectedColor.value = storedColor;
    setRootColor(storedColor); // Aplica el color al :root
  }
});
</script>

<template>
  <Header></Header>
  <main :style="{ backgroundImage: `url(${url_fondo})` }">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
    <Footer></Footer>
  </main>

  <div class="aspect" v-if="isLoginUser">
    <div class="options">
      <label for="opacidad">Color principal:</label>
      <input type="color" v-model="selectedColor" @input="updateColor" />
    </div>
  </div>
</template>

<style>
:root {
  --my-global-color: #a610ac;
}
main {
  width: 100%;
  position: relative;
  padding-top: 7%;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}

.aspect {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 20dvw;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1%;
  border-radius: 10px;
}
.aspect > .options {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  align-items: center;
}
.options label {
  width: 100%;
}
.options input {
  width: 100%;
}
</style>
