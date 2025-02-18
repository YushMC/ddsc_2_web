<template>
  <div>
    <div class="container_dashboard">
      <div class="container_info">
        <div class="welcome">
          <h1>Hola {{ tokenData.nombre }}!</h1>
          <h3>Rol: {{ tokenData.rol_nombre }}</h3>
        </div>
        <picture>
          <img :src="tokenData.url_logo" alt="" />
        </picture>
      </div>
      <div class="container_cards">
        <div class="card">
          <h4>Editar perfil <span>*</span></h4>
          <ul>
            <li>Foto de perfil, banner y fondo de pantalla</li>
            <li>Cambiar contraseña</li>
          </ul>
          <button @click="isActiveModal = true">Editar</button>
        </div>
        <div class="card">
          <h4>Notificaciones</h4>
          <label for="encenderNoti">Activar Notificaciones</label>
          <input
            type="checkbox"
            name=""
            id="encenderNoti"
            v-model="isChecked"
            @click="solicitarPermiso"
            :disabled="isChecked"
          />
        </div>
        <div
          class="card"
          v-if="
            tokenData.rol_nombre == 'creador' ||
            tokenData.rol_nombre == 'aportador' ||
            tokenData.rol_nombre == 'editor'
          "
        >
          <h4>Subir Mods</h4>
          <ul>
            <li>ATENCIÓN: Serás redirigido a la página antigua!</li>
          </ul>
          <a
            href="https://www.dokidokispanish.club/editores/subir"
            target="_blank"
            >Subir</a
          >
        </div>
        <div class="card" v-if="tokenData.rol_nombre == 'creador'">
          <h4>Enviar Mensaje Push Up</h4>
          <label for="tituloNoti">Titulo de la notificación</label>
          <input
            type="text"
            name=""
            id="tituloNoti"
            v-model="title_notification"
            maxlength="20"
          />
          <label for="mensajeNoti">Mensaje</label>
          <textarea
            name=""
            id="mensajeNoti"
            cols="30"
            rows="10"
            v-model="body_notification"
            maxlength="100"
          ></textarea>
          <button @click="enviarPush">Enviar</button>
        </div>
      </div>
      <div class="buttons">
        <button class="exit" @click="closeSession">Cerrar Sesión</button>
      </div>
    </div>
    <modalEdits></modalEdits>
    <div
      class="aspect"
      v-if="route.path == '/cuenta/inicio' && isAuthenticated"
    >
      <div class="options">
        <label for="opacidad">Color principal:</label>
        <input type="color" v-model="selectedColor" @input="updateColor" />
      </div>
    </div>
  </div>
</template>

<script setup>
import modalEdits from "../../components/cuenta/modalEdits.vue";
import { ref, onMounted, onBeforeMount } from "vue";
import { useInfoToken } from "../../composables/useInfoToken";
const { tokenData, isAuthenticated, urlFondo } = useInfoToken();

import { useModalCuenta } from "../../composables/useModalCuenta";
const { isActiveModal } = useModalCuenta();

const isChecked = ref(false);

import { useSessionStore } from "@/stores/session";
const sessionStore = useSessionStore();

import { useRoute } from "vue-router";
const route = useRoute();

import { useRouter } from "vue-router";
import Swal from "sweetalert2";
const router = useRouter();

const defaultColor = ref("#a610ac"); // Color predeterminado
const defaultColorTrasnparent = ref("54"); // Color predeterminado
const selectedColor = ref(defaultColor);
const url_fondo = ref(
  "https://www.dokidokispanish.club/assests/gui/Winter_Neva.png"
);

const title_notification = ref("Notificación!");
const icon_notification = ref(
  "https://www.dokidokispanish.club/assets/gui/Logo_DDSC.png"
);
const body_notification = ref("Este es un mensaje push!");
const url_notification = ref("https://new.dokidokispanish.club/");

const closeSession = async () => {
  try {
    const success = await sessionStore.logout();
    if (success) {
      isAuthenticated.value = false;
      localStorage.removeItem("myColor");
      defaultColor.value = "#a610ac";
      urlFondo.value =
        "https://www.dokidokispanish.club/assets/gui/Winter_Neva.png";
      setRootColor(defaultColor.value);
      router.push("/login");
    }
  } catch (error) {}
};

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

const enviarPush = async () => {
  Swal.fire({
    title: "Enviando Mensaje..",
    text: "Espera un momento por favor...",
    allowOutsideClick: false, // Evita el cierre al hacer clic fuera
    didOpen: () => {
      Swal.showLoading();
    },
  });
  await fetch("https://api.dokidokispanish.club/send-push", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title_notification.value,
      body: body_notification.value,
      url_noti: url_notification.value,
      icon_noti: icon_notification.value,
    }),
  });
  Swal.close();
};

onMounted(async () => {
  if (isAuthenticated.value) {
    const storedColor = localStorage.getItem("myColor") || defaultColor.value;
    selectedColor.value = storedColor;
    setRootColor(storedColor); // Aplica el color al :root
    url_fondo.value = tokenData.value.url_fondo;
  } else {
    const storedColor = defaultColor.value;
    selectedColor.value = storedColor;
    setRootColor(storedColor); // Aplica el color al :root
  }

  if (tokenData.value === undefined) {
    router.push("/login");
  }
  const registration = await navigator.serviceWorker.ready;

  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    isChecked.value = true;
  }
});

async function solicitarPermiso() {
  const permiso = await Notification.requestPermission();

  if (permiso !== "granted") {
    alert("Debes permitir las notificaciones para recibir alertas.");
    return;
  }

  // 🔹 Primero, obtener el Service Worker registrado
  const registration = await navigator.serviceWorker.ready;

  // 🔹 Luego, obtener la suscripción actual
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    Swal.fire({
      title: "Eliminando suscripción anterior...",
      allowOutsideClick: false, // Evita el cierre al hacer clic fuera
      didOpen: () => {
        Swal.showLoading();
      },
    });
    await existingSubscription.unsubscribe();
    Swal.close();
  }

  // Suscribirse a notificaciones Push
  const publicKey =
    "BIuTU82pi4qBD-sNaJNezG1kGs_cA5-Qb_ZaVQ1ZCj7PxvoqBSDe9q33cZO4BmVZRL-97GAYzu18rPxf7lSw1pk";

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await fetch("https://api.dokidokispanish.club/subscribe", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  Swal.fire({
    icon: "success",
    title: "Correcto",
    text: "Ahora recibirás notificaciones push!",
  });
}

// Función para convertir la clave pública a un formato Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
</script>

<style scoped>
.container_dashboard {
  padding-inline: 10%;
  padding-top: 15dvh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.container_info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container_info picture {
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_info picture img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 100%;
}
.container_cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: center;
}
.card {
  width: 100%;
  background: #ffffff4d;
  backdrop-filter: blur(5px);
  padding: 4%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 15rem !important;
}
.card h4 {
  width: fit-content;
  padding-bottom: 0.3rem;
  border-bottom: solid 2px var(--my-global-color);
}
.card ul {
  list-style: none;
}
.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttons button {
  width: fit-content;
  padding: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
button.exit {
  background: red;
  color: #fff;
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
  z-index: 90;
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

@media screen and (max-width: 800px) {
  .container_cards {
    display: flex;
    flex-direction: column;
  }
}
</style>
