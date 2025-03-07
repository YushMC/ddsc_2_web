<template>
  <li
    :id="props.id_comentario"
    :class="{ contenedor_respuesta: respuestas.length > 0 }"
  >
    <div
      class="comment"
      :style="{
        backgroundImage: `url(https://api.dokidokispanish.club/${props.banner})`,
      }"
    >
      <div class="info">
        <div class="datos_user">
          <img
            :src="`https://api.dokidokispanish.club/${props.logo}`"
            alt=""
            loading="lazy"
            @click="router.push(`/comunidad/perfil/${props.slug}`)"
          />
          <h5 @click="router.push(`/comunidad/perfil/${props.slug}`)">
            {{ props.user }}
          </h5>
        </div>
        <p>{{ props.comentario.comentario }}</p>
      </div>
      <!-- 
      <div class="actions">
        <button @click="toggleLike">{{ likes }} ❤️</button>
        <button @click="mostrarRespuesta = !mostrarRespuesta">Responder</button>
      </div>
      
    -->
      <div class="actions">
        <button @click="mostrarRespuesta = !mostrarRespuesta">Responder</button>
      </div>
    </div>

    <!-- Formulario de respuesta -->
    <form v-if="mostrarRespuesta" @submit.prevent="responder">
      <input v-model="respuestaTexto" placeholder="Escribe una respuesta" />
      <button type="submit">Enviar</button>
    </form>
    <!-- Subcomentarios -->
    <details v-if="respuestas.length > 0" class="respuestas">
      <summary style="cursor: pointer; font-size: 1rem">Respuestas</summary>
      <ul>
        <ComentarioItem
          v-for="respuesta in respuestas"
          :key="respuesta.id"
          :comentario="respuesta"
          :logo="respuesta.usuario_logo"
          :banner="respuesta.usuario_banner"
          :user="respuesta.usuario_nombre"
          :id_comentario="respuesta.id"
          :id_mod="respuesta.id_mod"
          :slug="respuesta.slug"
        />
      </ul>
    </details>
  </li>
</template>

<script setup>
import Swal from "sweetalert2";
import Loader from "../Loader.vue";
import { ref, onMounted, defineProps, defineEmits, onBeforeMount } from "vue";
import ComentarioItem from "./ComentarioItem.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  comentario: Object,
  banner: String,
  logo: String,
  user: String,
  id_mod: Number,
  id_comentario: Number,
  slug: String,
});
const emit = defineEmits(["respuesta"]);

const mostrarRespuesta = ref(false);
const respuestaTexto = ref("");
const likes = ref(0);
const isLoadResponses = ref(false);

/*
// Obtener la cantidad de "me gusta"
const obtenerLikes = async () => {
  try {
    const res = await fetch(
      `https://api.dokidokispanish.club/comments/likes/${props.id_comentario}`
    );
    const data = await res.json();
    likes.value = data.total_likes;
  } catch (error) {
    console.error("Error al obtener los likes:", error);
  }
};

// Alternar "me gusta"
const toggleLike = async () => {
  try {
    await fetch(
      "https://api.dokidokispanish.club/comments/like/${props.comentario}",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: 1,
          comentario_id: props.comentario.id,
        }),
      }
    );
  } catch (error) {
    console.error("Error al dar like:", error);
  }
};
*/
// Enviar respuesta
const responder = () => {
  if (!respuestaTexto.value.trim()) return;
  agregarComentario();
  respuestaTexto.value = "";
};

// Agregar un nuevo comentario
const agregarComentario = async () => {
  try {
    Swal.fire({
      title: "Guardando tu comentario",
      allowOutsideClick: false, // Evita el cierre al hacer clic fuera
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await fetch(
      "https://api.dokidokispanish.club/create-comment",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idMod: props.id_mod,
          parent_id: props.id_comentario,
          contenido: respuestaTexto.value,
        }),
      }
    );
    Swal.close();
    const data = await response.json();
    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Ocurrio un error al guardar tu comentario.",
        text: JSON.stringify(data.error),
      });
    }
    respuestaTexto.value = "";
    Swal.fire({
      title: "Comentario guardado correctamente!",
      text: JSON.stringify(data.message),
      icon: "success",
    });
    await obtenerComentarios();
  } catch (error) {
    console.error("Error al agregar comentario:", error);
  }
};
const respuestas = ref([]);
const obtenerComentarios = async () => {
  try {
    const res = await fetch(
      `https://api.dokidokispanish.club/comments/replies/${props.id_comentario}`
    );

    if (res.ok) {
      const data = await res.json();
      respuestas.value = data.respuestas;
      isLoadResponses.value = true;
    }
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
  }
};

onBeforeMount(async () => {
  await obtenerComentarios();
});
</script>

<style scoped>
ul {
  width: 100%;
  list-style: none;
}
li {
  min-width: 10rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  right: 0;
}

.comment {
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  border: solid 2px var(--color_fondo);
  color: #fff;
}
.info {
  display: grid;
  grid-template-columns: 1fr 4fr;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
}
.datos_user {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.datos_user img {
  width: 5rem;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 100%;
}
.actions {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: start;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}
.respuestas {
  width: 100%;
  min-width: 20rem !important;
  position: relative;
  display: flex;
  justify-content: end;
  align-items: end;
  flex-direction: column;
  gap: 1rem;
}
.respuestas li {
  width: 90% !important;
  gap: 0 !important;
}
.contenedor_respuesta {
  padding: 1rem;
  background: #ffffff83;
  border-radius: 10px;
}
@media screen and (max-width: 800px) {
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
}
</style>
