<template>
  <div class="estructura">
    <form @submit.prevent="login" id="loginForm" v-if="!isLoginUser">
      <input type="email" placeholder="Email" v-model="email" required />
      <input
        type="password"
        name=""
        id=""
        placeholder="Contraseña"
        v-model="password"
        required
      />
      <input type="submit" value="Entrar" :disabled="isLoading" />
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </form>
    <button v-else @click="logout" class="exit">Cerrar Sesión</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useSessionStore } from "@/stores/session";

const authStore = useSessionStore();
const isLoginUser = ref(false);

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const login = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.post(
      "https://www.dokidokispanish.club/api_ddsc/login",
      {
        email: email.value,
        password: password.value,
      },
      {
        headers: {
          "Content-Type": "application/json", // Agregar el encabezado Content-Type
        },
      }
    );

    // Guardar el token recibido en el localStorage
    const token = response.data.token;
    localStorage.setItem("token", token);
    const id_user = response.data.user;
    localStorage.setItem("user", id_user);

    alert("Inicio de sesión exitoso");
    window.location.reload();
  } catch (error) {
    errorMessage.value = "Credenciales incorrectas o error del servidor.";
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  authStore.logout();
};

onMounted(() => {
  if (localStorage.getItem("user")) {
    isLoginUser.value = true;
  }
});
</script>

<style scoped>
#loginForm {
  margin: 0 30%;
  margin-bottom: 100px;
  padding: 2%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  backdrop-filter: blur(4px);
  border-radius: 10px;
}
#loginForm input {
  width: 100%;
  padding: 1%;
}
#loginForm input[type="submit"] {
  background: #a710ac;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.exit {
  width: 80%;
  margin: 0 10%;
  margin-bottom: 2%;
  padding: 2%;
  background: rgb(134, 1, 1);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
}
</style>
