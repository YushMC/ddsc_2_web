<template>
  <div class="estructura">
    <div class="container_switch">
      <button :class="{ active: isloginActive }" @click="isloginActive = true">
        Iniciar Sesión
      </button>
      <button
        @click="isloginActive = false"
        :class="{ active: !isloginActive }"
      >
        <span v-if="!sessionStore.codeNew">Crear Cuenta</span>
        <span v-else>Verificar Cuenta</span>
      </button>
    </div>
    <div class="container_forms">
      <form :class="{ active: isloginActive }">
        <div class="container_input">
          <label for="">Correo Electrónico</label>
          <input type="email" v-model="email" />
        </div>
        <div class="container_input">
          <label for="">Contraseña</label>
          <input
            :type="isPassword1Visible ? 'text' : 'password'"
            v-model="password"
          />
          <img
            src="/gui/visible_pswd.svg"
            v-if="isPassword1Visible"
            @click.prevent="togglePaswword1"
            loading="lazy"
          />
          <img
            src="/gui/hidden_pswd.svg"
            alt=""
            v-else
            @click.prevent="togglePaswword1"
            loading="lazy"
          />
        </div>
        <button type="submit" @click.prevent="login">Entrar</button>
        <details>
          <summary>Recuperar Cuenta</summary>
          <div class="container_input">
            <label for="">Código de recuperación</label>
            <input type="text" v-model="recoveryCode" />
            <button type="submit" @click.prevent="LoginRecovery">Entrar</button>
          </div>
        </details>
      </form>
      <form action="" :class="{ active: !isloginActive }">
        <div
          style="display: flex; flex-direction: column; width: 100%; gap: 2rem"
          v-if="!sessionStore.codeNew"
        >
          <div class="container_input">
            <label for="">Nombre de Usuario <span>*</span></label>
            <input type="text" v-model="user" />
          </div>
          <div class="container_input">
            <label for="">Correo Electrónico <span>*</span></label>
            <input type="text" v-model="email" />
          </div>
          <div class="container_input">
            <label for="">Nacionalidad: <span>*</span></label>
            <select name="" id="" v-model="country">
              <option value="1">Argentina</option>
              <option value="2">Bolivia</option>
              <option value="3">Chile</option>
              <option value="4">Colombia</option>
              <option value="5">Costa Rica</option>
              <option value="6">Cuba</option>
              <option value="7">Ecuador</option>
              <option value="8">El Salvador</option>
              <option value="9">España</option>
              <option value="10">Estados Unidos de América</option>
              <option value="11">Guatemala</option>
              <option value="12">Honduras</option>
              <option value="13">México</option>
              <option value="14">Nicaragua</option>
              <option value="15">Panamá</option>
              <option value="16">Paraguay</option>
              <option value="17">Perú</option>
              <option value="18">Republica Dominicana</option>
              <option value="19">Uruguay</option>
              <option value="20">Venezuela</option>
            </select>
          </div>
          <div class="container_input">
            <label for="">Contraseña <span>*</span></label>
            <input
              :type="isPassword1Visible ? 'text' : 'password'"
              v-model="password"
              :class="{ error: errorClass }"
            />
            <img
              src="/gui/visible_pswd.svg"
              v-if="isPassword1Visible"
              @click.prevent="togglePaswword1"
              loading="lazy"
            />
            <img
              src="/gui/hidden_pswd.svg"
              alt=""
              v-else
              @click.prevent="togglePaswword1"
              loading="lazy"
            />
            <span style="color: red" v-if="errorClass"
              >Las contraseñas no coinciden</span
            >
          </div>
          <div class="container_input">
            <label for="">Repetir Contraseña <span>*</span></label>
            <input
              :type="isPassword2Visible ? 'text' : 'password'"
              v-model="password2"
              :class="{ error: errorClass }"
            />
            <img
              src="/gui/visible_pswd.svg"
              v-if="isPassword2Visible"
              @click.prevent="togglePaswword2"
              loading="lazy"
            />
            <img
              src="/gui/hidden_pswd.svg"
              alt=""
              v-else
              @click.prevent="togglePaswword2"
              loading="lazy"
            />
            <span style="color: red" v-if="errorClass"
              >Las contraseñas no coinciden</span
            >
          </div>
          <h6 style="color: red">* Obligatorio</h6>

          <button type="submit" @click.prevent="registerUser">Crear</button>
        </div>
        <div
          v-else
          style="display: flex; flex-direction: column; width: 100%; gap: 2rem"
        >
          <div class="container_input">
            <label for="">Ingresa el código de verficación.</label>
            <input
              type="numbre"
              maxlength="6"
              minlength="6"
              v-model="codeVerify"
              placeholder="xxxxxx"
            />
            <button @click.prevent="verificar">Verificar</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";

import { useRouter } from "vue-router";
const router = useRouter();
// import ReCaptcha from "../components/ReCaptcha.vue";

import { useInfoToken } from "../composables/useInfoToken";
const { getToken, isAuthenticated, tokenData } = useInfoToken();

import { useSessionStore } from "@/stores/session";
const sessionStore = useSessionStore();

const isloginActive = ref(true);
const isRecoveryActive = ref(false);

const authStore = useSessionStore();
const isLoginUser = ref(false);

const email = ref("");
const password = ref("");
const isPassword1Visible = ref(false);
const isPassword2Visible = ref(false);
const password2 = ref("");
const errorClass = ref(false);
const country = ref(1);
const user = ref("");
const recoveryCode = ref("");

const codeVerify = ref(0);
const togglePaswword1 = () => {
  isPassword1Visible.value = !isPassword1Visible.value;
};
const togglePaswword2 = () => {
  isPassword2Visible.value = !isPassword2Visible.value;
};
const login = async () => {
  const success = await sessionStore.login(email.value, password.value);
  if (success) {
    getToken();
    isAuthenticated.value = true;
    router.push("/cuenta");
  }
};

const LoginRecovery = async () => {
  if (!recoveryCode.value.trim() == "") {
    const success = await sessionStore.loginRecovery(recoveryCode.value);
    if (success) {
      getToken();
      isAuthenticated.value = true;
      router.push("/cuenta/inicio");
    }
  }
};

watch(password2, (newValue) => {
  if (password2.value.trim() !== password.value) {
    errorClass.value = true;
  } else {
    errorClass.value = false;
  }
});

const registerUser = async () => {
  if (password2.value.trim() === password.value.trim()) {
    if (user.value.trim() !== "" && password.value.trim() !== 0) {
      Swal.fire({
        icon: "warning",
        title: "Se guardará el usuario con lo siguientes datos importantes!",
        html: `<p>Nombre de usuario: <b>${user.value}</b><br>Correo: <b>${email.value}</b><br>Recomendamos revisar si son correctos estos datos antes de continuar!</p>`,
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Crear Cuenta!",
        allowOutsideClick: false, // Evita el cierre al hacer clic fuera
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStore.registerUser(
            user.value,
            email.value,
            password.value,
            country.value
          );
          getToken();
          isAuthenticated.value = true;
          router.push("/cuenta");
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "No pueden existir campos vacios!",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Las contraseñas no coinciden!",
    });
  }
};

const verificar = async () => {
  await sessionStore.verify(
    codeVerify.value,
    localStorage.getItem("email").toString() || null
  );
};
if (isAuthenticated.value && tokenData.value !== undefined) {
  router.push("/cuenta/inicio");
}

onBeforeMount(() => {});
onMounted(() => {
  if (localStorage.getItem("user")) {
    isLoginUser.value = true;
  }
  document.title = "Iniciar Sesión - Doki Doki Spanish Club";
});
</script>

<style scoped>
.estructura {
  width: 100%;
  height: 100%;
  padding-inline: 10%;
  padding-block: 15dvh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.container_switch {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_switch button {
  border: none;
  width: fit-content;
  padding: 1rem;
  opacity: 0.8;
  cursor: pointer;
  transition: all 0.3s linear;
}
.container_switch button.active {
  background: var(--my-global-color);
  color: #fff;
  opacity: 1;
}
.container_switch button:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.container_switch button:last-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.container_switch button {
  border-radius: 0px;
  background: #fff;
  color: #000;
}
details {
  width: 100%;
}
summary {
  cursor: pointer;
}
</style>
