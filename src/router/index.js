import { createRouter, createWebHistory } from "vue-router";
import Inicio from "../views/Inicio.vue";
import Mod from "../views/mod.vue";
import Traducciones from "../views/Traducciones.vue";
import Mods from "../views/Mods.vue";
import Login from "../views/login.vue";
import cuentaInicio from "../views/cuenta/index.vue";
import perfil from "../views/comunidad/perfil.vue";
import subir from "../views/cuenta/subir.vue";
import editar from "../views/cuenta/editar.vue";

import { useInfoToken } from "../composables/useInfoToken.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Inicio,
    meta: { index: 0 },
  },
  {
    path: "/traducciones",
    name: "Traduccioens",
    component: Traducciones,
    meta: { index: 0 },
  },
  {
    path: "/mods",
    name: "Mods",
    component: Mods,
    meta: { index: 0 },
  },
  {
    path: "/mod/:id",
    name: "Mod",
    component: Mod,
    props: true, // Pasar parámetros de la URL como props
    meta: { index: 1 },
  },
  {
    path: "/comunidad/perfil/:slug",
    name: "Perfil",
    component: perfil,
    props: true, // Pasar parámetros de la URL como props
    meta: { index: 1 },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { index: 0 },
  },
  {
    path: "/cuenta",
    name: "cuenta",
    component: cuentaInicio,
    meta: { requiresAuth: true },
  },
  ,
  {
    path: "/cuenta/subir",
    name: "Subir Mod",
    component: subir,
  },
  {
    path: "/cuenta/editar/:slug",
    name: "EditarMod",
    component: editar,
    props: true, // Pasar parámetros de la URL como props
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, left: 0, behavior: "smooth" };
  },
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, getToken } = useInfoToken();

  if (to.meta.requiresAuth) {
    await getToken();
    if (!isAuthenticated.value) {
      return next("/login");
    }
  }
  next();
});

export default router;
