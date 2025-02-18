<template>
  <button @click="recaptcha">Verificar con recaptcha</button>
</template>

<script setup>
import { useReCaptcha } from "vue-recaptcha-v3";
import { ref } from "vue";

const siteKey = "6LfMEtIqAAAAAAEaZHCA-n8-o0dKJtlerrXaItBu"; // Reemplázala con tu clave de reCAPTCHA

const token = ref("");

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

const recaptcha = async () => {
  await recaptchaLoaded();
  const token = await executeRecaptcha("login");
};
</script>

<style scoped></style>
