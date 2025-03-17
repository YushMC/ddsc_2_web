import { ref } from "vue";

const isLoginUser = ref(false);
const isMenuResponsive = ref(false);
const isActiveSearchBar = ref(false);

export const useHeaderComposable = () => {
  return {
    isLoginUser,
    isMenuResponsive,
    isActiveSearchBar,
  };
};
