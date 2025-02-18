import { ref } from "vue";

const isActiveModal = ref(false);

export const useModalCuenta = () => {
  return {
    isActiveModal,
  };
};
