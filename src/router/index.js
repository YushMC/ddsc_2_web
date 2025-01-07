import { createRouter, createWebHistory } from "vue-router";
import Inicio from "../views/Inicio.vue";
import Mod from "../views/mod.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Inicio,
    meta: { index: 0 },
  },
  {
    path: "/mod/:id",
    name: "Mod",
    component: Mod,
    props: true, // Pasar parámetros de la URL como props
    meta: { index: 1 },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
