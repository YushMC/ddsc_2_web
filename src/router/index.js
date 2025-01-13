import { createRouter, createWebHistory } from "vue-router";
import Inicio from "../views/Inicio.vue";
import Mod from "../views/mod.vue";
import Traducciones from "../views/Traducciones.vue";
import Mods from "../views/Mods.vue";
import Login from "../views/login.vue";

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
    path: "/login",
    name: "Login",
    component: Login,
    meta: { index: 0 },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
