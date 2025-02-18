<template>
  <li>
    <div
      class="comment"
      :style="{
        backgroundImage: `url(https://api.dokidokispanish.club/${props.banner})`,
      }"
    >
      <div class="info">
        <div class="datos_user">
          <img :src="`https://api.dokidokispanish.club/${props.logo}`" alt="" />
          <h5>{{ props.user }}</h5>
        </div>
        <p>{{ props.comentario }}</p>
      </div>

      <div class="actions">
        <!-- Botón de "Me gusta" -->
        <button @click="toggleLike">{{ likes }} ❤️</button>
        <!-- Botón para mostrar/ocultar el formulario de respuesta -->
        <button @click="mostrarRespuesta = !mostrarRespuesta">Responder</button>
      </div>
    </div>
    <!-- Formulario de respuesta -->
    <form v-if="mostrarRespuesta" @submit.prevent="responder">
      <input v-model="respuestaTexto" placeholder="Escribe una respuesta" />
      <button type="submit">Enviar</button>
    </form>

    <!-- Subcomentarios -->
    <ul>
      <ComentarioItem
        v-for="respuesta in comentario.respuestas"
        :key="respuesta.id"
        :id_comentario="respuesta.id"
        :banner="respuesta.usuario_banner"
        :logo="respuesta.usuario_logo"
        :user="respuesta.usuario_nombre"
        :comentario="respuesta.comentario"
        :id_mod="respuesta.id_mod"
        @respuesta="$emit('respuesta', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from "vue";
import ComentarioItem from "./ComentarioItem.vue";

const props = defineProps({
  comentario: String,
  banner: String,
  logo: String,
  user: String,
  id_mod: Number,
  id_comentario: Number,
});
const emit = defineEmits(["respuesta"]);

const mostrarRespuesta = ref(false);
const respuestaTexto = ref("");
const likes = ref(0);

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
    obtenerLikes(); // Actualizar el contador
  } catch (error) {
    console.error("Error al dar like:", error);
  }
};

// Enviar respuesta
const responder = () => {
  if (!respuestaTexto.value.trim()) return;
  agregarComentario();
  respuestaTexto.value = "";
};

// Agregar un nuevo comentario
const agregarComentario = async () => {
  if (!nuevoComentario.value.trim()) return;

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
    Swal.fire({
      title: "Comentario guardado correctamente!",
      text: JSON.stringify(data.message),
      icon: "success",
    });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
  }
};

obtenerLikes();
onMounted(async () => {
  await obtenerLikes();
});
</script>

<style scoped>
ul {
  width: 100%;
  list-style: none;
}
li {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
</style>
