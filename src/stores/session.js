import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { register } from "swiper/element";

export const useSessionStore = defineStore("session", {
  state: () => ({
    accessToken: null, // No se guarda en localStorage
    codeNew: localStorage.getItem("codeNew") || null, // Restaurar usuario,
    codeCurrently: null,
  }),
  actions: {
    async login(email, pass) {
      try {
        Swal.fire({
          title: "Iniciando Sesión",
          allowOutsideClick: false, // Evita el cierre al hacer clic fuera
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const response = await fetch("https://api.dokidokispanish.club/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: pass,
          }),
          credentials: "include", // Importante para manejar cookies HTTP-only
        });
        const data = await response.json();
        Swal.close();
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Ocurrio un error al iniciar sesión",
            text: JSON.stringify(data.error),
          });
          return false;
        }
        this.accessToken = data.token;
        Swal.fire({
          title: "Bienvenido!",
          icon: "success",
        });
        return true;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error al iniciar sesión",
          text: JSON.stringify(error),
        });
        return false;
      }
    },

    async loginRecovery(code) {
      try {
        Swal.fire({
          title: "Revisando código...",
          allowOutsideClick: false, // Evita el cierre al hacer clic fuera
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const response = await fetch(
          "https://api.dokidokispanish.club/recovery-code",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recovery_code: code,
            }),
            credentials: "include", // Importante para manejar cookies HTTP-only
          }
        );
        const data = await response.json();
        Swal.close();
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Ocurrio un error al iniciar sesión",
            text: JSON.stringify(data.error),
          });
          return false;
        }
        this.accessToken = data.token;
        Swal.fire({
          title: "Bienvenido!",
          icon: "success",
          text: JSON.stringify(data.message),
        });
        return true;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error al iniciar sesión",
          text: JSON.stringify(error),
        });
        return false;
      }
    },

    async checkSession() {
      try {
        const response = await fetch("https://api.dokidokispanish.club/user", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Sesión no válida");
        this.accessToken = data.token;
      } catch (error) {
        console.error("Sesión expirada:", error);
        this.logout();
      }
    },

    async verify(code, email) {
      try {
        Swal.fire({
          title: "Verificando cuenta..",
          text: "Espera un momento por favor...",
          allowOutsideClick: false, // Evita el cierre al hacer clic fuera
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const response = await fetch(
          "https://api.dokidokispanish.club/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: code,
              email: email,
            }),
          }
        );
        const data = await response.json();
        Swal.close();
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Ocurrio un error al verificar la cuenta.",
            text: JSON.stringify(data.error),
          });
          return false;
        }
        Swal.fire({
          title: "Correcto!",
          icon: "success",
          text: JSON.stringify(data.message),
        });
        localStorage.removeItem("codeNew"); // remover el codigo
        localStorage.removeItem("email");
        this.codeNew = false;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error al verificar la cuenta.",
          text: JSON.stringify(error),
        });
      }
    },

    async registerUser(user, email, pass, country) {
      try {
        Swal.fire({
          title: "Creando Cuenta",
          allowOutsideClick: false, // Evita el cierre al hacer clic fuera
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const response = await fetch(
          "https://api.dokidokispanish.club/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: user,
              password: pass,
              email: email,
              country: country,
            }),
          }
        );
        const data = await response.json();
        Swal.close();
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Ocurrio un error al crear la cuenta.",
            text: JSON.stringify(data.error),
          });
          return false;
        }
        Swal.fire({
          title: "Bienvenido!",
          icon: "success",
          text: JSON.stringify(data.message),
        });
        localStorage.setItem("codeNew", true); // Guardar usuario
        localStorage.setItem("email", email);
        this.codeNew = true;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error al crear la cuenta.",
          text: JSON.stringify(error),
        });
      }
    },

    async updatePhoto(file) {
      Swal.fire({
        title: "Realizando cambios..",
        allowOutsideClick: false, // Evita el cierre al hacer clic fuera
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://api.dokidokispanish.club/update-photo",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      Swal.close();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error al actualizar la foto de perfil.",
          text: JSON.stringify(data.error),
        });
        return false;
      }
      const data = await response.json();

      Swal.fire({
        title: "Correcto!",
        icon: "success",
        text: JSON.stringify(data.message),
      });
      return true;
    },

    async updateBanner(file) {
      Swal.fire({
        title: "Realizando cambios..",
        allowOutsideClick: false, // Evita el cierre al hacer clic fuera
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://api.dokidokispanish.club/update-banner",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      Swal.close();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error al actualizar el banner de perfil.",
          text: JSON.stringify(data.error),
        });
        return false;
      }
      const data = await response.json();

      Swal.fire({
        title: "Correcto!",
        icon: "success",
        text: JSON.stringify(data.message),
      });
      return true;
    },

    async updateWallpaper(file) {
      Swal.fire({
        title: "Realizando cambios..",
        allowOutsideClick: false, // Evita el cierre al hacer clic fuera
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://api.dokidokispanish.club/update-wallpaper",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      Swal.close();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error al actualizar el fondo de pantalla.",
          text: JSON.stringify(data.error),
        });
        return false;
      }
      const data = await response.json();

      Swal.fire({
        title: "Correcto!",
        icon: "success",
        text: JSON.stringify(data.message),
      });
      return true;
    },

    async changePswd(new_pass, old_pass) {
      Swal.fire({
        title: "Realizando cambios..",
        allowOutsideClick: false, // Evita el cierre al hacer clic fuera
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await fetch(
        "https://api.dokidokispanish.club/change-password",
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            old_pass: old_pass,
            new_pass: new_pass,
          }),
        }
      );
      const data = await response.json();
      Swal.close();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error al actualizar la contraseña.",
          text: JSON.stringify(data.error),
        });
        return false;
      }
      Swal.fire({
        title: "Correcto!",
        icon: "success",
        text: JSON.stringify(data.message),
      });
      return true;
    },

    async changeAlias(alias) {
      Swal.fire({
        title: "Realizando cambios..",
        allowOutsideClick: false, // Evita el cierre al hacer clic fuera
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await fetch(
        "https://api.dokidokispanish.club/change-alias",
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alias: alias,
          }),
        }
      );
      const data = await response.json();
      Swal.close();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error al actualizar el alias.",
          text: JSON.stringify(data.error),
        });
        return false;
      }
      Swal.fire({
        title: "Correcto!",
        icon: "success",
        text: JSON.stringify(data.message),
      });
      return true;
    },

    async logout() {
      try {
        Swal.fire({
          title: "Cerrando Sessión",
          allowOutsideClick: false, // Evita el cierre al hacer clic fuera
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.user = null;
        this.accessToken = null;

        const response = await fetch(
          "https://api.dokidokispanish.club/logout",
          {
            method: "POST",
            credentials: "include", // Elimina la cookie HTTP-only
          }
        );
        const data = await response.json();
        Swal.close();
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Ocurrio un error al cerrar sesión.",
            text: JSON.stringify(data.error),
          });
          return false;
        }
        Swal.fire({
          title: "Correcto!",
          icon: "success",
          text: JSON.stringify(data.message),
        });
        return true;
      } catch (error) {}
    },
  },
});
