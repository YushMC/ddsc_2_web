<template>
  <div class="modal" :class="{ active: isActiveModal }">
    <h4>Editar</h4>
    <div class="container_forms">
      <details open>
        <summary>Cambiar alias</summary>
        <form class="active">
          <div class="container_input">
            <label for=""
              >Alias de usuario (Nombre a mostrar a los otros usuarios)</label
            >
            <input type="text" v-model="alias" />
          </div>
          <button type="submit" @click.prevent="changeAlias">
            Cambiar Alias
          </button>
        </form>
      </details>
      <details>
        <summary>Cambiar Contraseña</summary>
        <form class="active">
          <div class="container_input">
            <label for="">Contraseña actual</label>
            <input
              :type="isPassword1Visible ? 'text' : 'password'"
              v-model="password1"
            />
            <img
              src="/gui/visible_pswd.svg"
              v-if="isPassword1Visible"
              @click.prevent="togglePaswword1"
            />
            <img
              src="/gui/hidden_pswd.svg"
              alt=""
              v-else
              @click.prevent="togglePaswword1"
            />
          </div>
          <div class="container_input">
            <label for="">Nueva contraseña</label>
            <input
              :type="isPassword2Visible ? 'text' : 'password'"
              v-model="password2"
            />
            <img
              src="/gui/visible_pswd.svg"
              v-if="isPassword2Visible"
              @click.prevent="togglePaswword2"
            />
            <img
              src="/gui/hidden_pswd.svg"
              alt=""
              v-else
              @click.prevent="togglePaswword2"
            />
          </div>
          <button type="submit" @click.prevent="changePassword">
            Cambiar Contraseña
          </button>
        </form>
      </details>
      <details>
        <summary>Cambiar Imagenes</summary>
        <form class="active">
          <div class="container_input">
            <label for="">Perfil</label>
            <input type="file" @change="changePhoto" />
          </div>
          <div class="container_input">
            <label for="">Banner</label>
            <input type="file" @change="changeBanner" />
          </div>
          <div class="container_input">
            <label for="">Fondo de Pantalla</label>
            <input type="file" @change="changeWallpaper" />
          </div>
          <button type="submit" @click.prevent="login">Entrar</button>
        </form>
      </details>
    </div>
  </div>
  <div
    class="cerarrModal"
    @click="toggleModal"
    :class="{ desactive: !isActiveModal }"
  ></div>
</template>

<script setup>
import { useModalCuenta } from "../../composables/useModalCuenta";
const { isActiveModal } = useModalCuenta();

import { useInfoToken } from "../../composables/useInfoToken";
const { getToken, tokenData } = useInfoToken();

import { useSessionStore } from "@/stores/session";
import Swal from "sweetalert2";
const sessionStore = useSessionStore();

const toggleModal = () => {
  isActiveModal.value = false;
};

import { ref } from "vue";

const password1 = ref("");
const password2 = ref("");
const isPassword1Visible = ref(false);
const isPassword2Visible = ref(false);
const alias = ref(tokenData.value.alias);

const togglePaswword1 = () => {
  isPassword1Visible.value = !isPassword1Visible.value;
};
const togglePaswword2 = () => {
  isPassword2Visible.value = !isPassword2Visible.value;
};

const changePassword = async () => {
  if (password1.value.trim() === "" || password2.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Las contraseñas no pueden estar vacias.",
    });
    return false;
  } else {
    try {
      const success = await sessionStore.changePswd(
        password2.value,
        password1.value
      );
      if (success) {
        getToken();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocurrio un error",
        text: error,
      });
    }
  }
};

const changePhoto = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const success = await sessionStore.updatePhoto(file);
    if (success) {
      getToken();
    }
  }
};

const changeAlias = async () => {
  if (alias.value.trim() !== "") {
    const success = await sessionStore.updatePhoto(file);
    if (success) {
      getToken();
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "El alias no puede estar vacio",
    });
  }
};

const changeBanner = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const success = await sessionStore.updateBanner(file);
    if (success) {
      getToken();
    }
  }
};

const changeWallpaper = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const success = await sessionStore.updateWallpaper(file);
    if (success) {
      getToken();
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed !important;
  top: 5dvh;
  left: 20dvw;

  min-width: 0;
  margin: auto;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  transform: scale(0);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s linear;
  z-index: 120;
  border-radius: 20px;
  padding: 2%;
}

.active {
  width: 60dvw;
  height: 90dvh;
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.cerarrModal {
  position: fixed;
  background: #00000031;
  width: 100%;
  height: 100dvh;
  z-index: 105;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
}
.desactive {
  display: none;
}
.container_forms {
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: initial;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
}
.container_forms form {
  width: 100%;
  background: none;
}
details {
  width: 100%;
}
</style>
