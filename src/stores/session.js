import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useSessionStore = defineStore("session", {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    login(userData, token) {
      this.user = userData;
      this.token = token;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      window.location.reload();
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.reload();
    },
    restoreSession() {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (user && token) {
        this.user = JSON.parse(user);
        this.token = token;
      }
      window.location.reload();
    },
  },
});
