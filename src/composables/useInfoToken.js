import { ref } from "vue";

const tokenData = ref([]);
const isAuthenticated = ref(false);
const isLoadData = ref(false);
const urlFondo = ref(
  "https://www.dokidokispanish.club/assets/gui/Winter_Neva.png"
);

export const useInfoToken = () => {
  const getToken = async () => {
    try {
      const response = await fetch("https://api.dokidokispanish.club/session", {
        method: "GET",
        credentials: "include", // Importante para incluir cookies HTTP-Only
      });

      if (!response.ok) {
        isAuthenticated.value = false;
      }

      const data = await response.json();
      if (data.error) {
        isAuthenticated.value = false;
      }
      tokenData.value = data.token_decodificado;
      urlFondo.value = tokenData.value.url_fondo;
      isAuthenticated.value = true;
      isLoadData.value = true;
    } catch (error) {
      isAuthenticated.value = false;
    }
  };

  return {
    getToken,
    tokenData,
    isAuthenticated,
    isLoadData,
    urlFondo,
  };
};
