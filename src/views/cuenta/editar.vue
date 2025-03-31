<template>
  <div class="formulario">
    <form action="">
      <div class="container_portada">
        <img
          src="https://www.dokidokispanish.club/assets/gui/banner_comunidad.jpg"
          alt=""
          loading="lazy"
        />
        <div class="container_text">
          <h1>Editar Mod</h1>
          <p>
            Recuerda subir los datos correctos!, asegurate de contar con tu
            cuenta de DDSC antes de llenar este formulario.
          </p>
        </div>
      </div>
      <div
        style="display: flex; flex-direction: column; width: 100%; gap: 2rem"
      >
        <div class="container_input">
          <label for="">Nombre del Mod</label>
          <input type="text" v-model="infoMod.nombre" disabled />
        </div>
        <div class="container_input">
          <label for="">Descripción: </label>
          <h6
            :style="{
              color: infoMod.descripcion.length > 1000 ? 'red' : 'black',
            }"
          >
            Carateres usados: {{ infoMod.descripcion.length }}/ 1000
          </h6>
          <textarea
            type="text"
            v-model="infoMod.descripcion"
            rows="15"
            cols="10"
            :style="{
              color: infoMod.descripcion.length > 1000 ? 'red' : 'black',
            }"
          >
          </textarea>
        </div>
        <button
          type="submit"
          style="width: 100% !important"
          @click.prevent="editDescription()"
        >
          Editar Descripción
        </button>
        <div class="container_input">
          <label for="">Estado: </label>
          <select name="" id="" v-model="infoMod.estado">
            <option
              v-for="option in optionsEstado"
              :key="option?.id"
              :value="option?.id"
            >
              {{ option?.estado }}
            </option>
          </select>
        </div>
        <button
          type="submit"
          style="width: 100% !important"
          @click.prevent="fetchEdit(2, 'change-state')"
        >
          Editar Tipo
        </button>
        <div class="container_input">
          <label for="">Duración: </label>
          <select name="" id="" v-model="infoMod.duracion">
            <option
              v-for="option in optionsDuracion"
              :key="option?.id"
              :value="option?.id"
            >
              {{ option?.duracion }}
            </option>
          </select>
        </div>
        <button
          type="submit"
          style="width: 100% !important"
          @click.prevent="fetchEdit(3, 'change-duration')"
        >
          Editar Descripción
        </button>
        <div class="container_input">
          <label for="">Enfoque: </label>
          <select name="" id="" v-model="infoMod.personaje">
            <option
              v-for="option in optionsEnfoque"
              :key="option?.id"
              :value="option?.id"
            >
              {{ option?.enfoque }}
            </option>
          </select>
        </div>
        <button
          type="submit"
          style="width: 100% !important"
          @click.prevent="fetchEdit(4, 'change-focus')"
        >
          Editar Enfoque
        </button>
        <div class="container_input" v-if="infoMod.estado !== '3'">
          <label for="">Fecha de lanzamiento: </label>
          <input type="date" v-model="infoMod.created" />
        </div>
        <button
          type="submit"
          style="width: 100% !important"
          @click.prevent="fetchEdit(5, 'change-date')"
        >
          Editar Fecha
        </button>
        <div class="container_input">
          <label for=""
            >Contiene escenas +18 o no aptas para todo el público:
          </label>
          <select v-model="infoMod.isNSFW">
            <option value="0">No</option>
            <option value="1">Sí</option>
          </select>
        </div>
        <button
          type="submit"
          style="width: 100% !important"
          @click.prevent="fetchEdit(6, 'change-nsfw')"
        >
          Editar Restricción
        </button>
        <div class="container_input" v-if="infoMod.estado !== '3'">
          <label for="">Link de descarga PC: </label>
          <input type="text" v-model="infoMod.pc" />
        </div>
        <button
          type="submit"
          style="width: 100% !important"
          @click.prevent="fetchEdit(7, 'change-link-pc')"
        >
          Editar Enlace
        </button>
        <div class="container_input" v-if="infoMod.estado !== '3'">
          <label for="">Link de descarga Android: </label>
          <input type="text" v-model="infoMod.android" />
        </div>
        <button
          type="submit"
          style="width: 100% !important"
          @click.prevent="fetchEdit(8, 'change-link-android')"
        >
          Editar Enlace
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import { Mod } from "../../classes/mod";

const infoMod = ref(new Mod());

const optionsDuracion = ref([]); // Almacena las opciones de la API
const fetchOptionsDuracion = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/mods/options/duration"
    ); // Cambia por tu URL
    const data = await response.json();
    optionsDuracion.value = data.results; // Suponiendo que la API devuelve un array de strings
  } catch (error) {
    console.error("Error al obtener opciones:", error);
  }
};

const optionsEnfoque = ref([]); // Almacena las opciones de la API
const fetchOptionsEnfoque = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/mods/options/focus-on"
    ); // Cambia por tu URL
    const data = await response.json();
    optionsEnfoque.value = data.results; // Suponiendo que la API devuelve un array de strings
  } catch (error) {
    console.error("Error al obtener opciones:", error);
  }
};

const optionsEstado = ref([]); // Almacena las opciones de la API
const fetchOptionsEstado = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/mods/options/status"
    ); // Cambia por tu URL
    const data = await response.json();
    optionsEstado.value = data.results; // Suponiendo que la API devuelve un array de strings
  } catch (error) {
    console.error("Error al obtener opciones:", error);
  }
};

const optionsGenero = ref([]); // Lista de géneros obtenidos de la API
const selectedOptionsGenero = ref([]); // Géneros seleccionados
const selectedValueGenero = ref(""); // Valor actual del select

const fetchOptionsGenero = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/mods/options/genere"
    ); // Asegúrate de que esta URL devuelve un array de objetos con { id, genero }
    const data = await response.json();
    optionsGenero.value = data.results;
  } catch (error) {
    console.error("Error al obtener géneros:", error);
  }
};

import { useRoute } from "vue-router";
const route = useRoute();

const fetchModsSlug = async (slug) => {
  try {
    const response = await fetch(
      `https://api.dokidokispanish.club/mod/indexs/${slug}`
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const jsonData = await response.json();
    infoMod.value = jsonData.results || {};
    infoMod.value.created = jsonData.results?.created.slice(0, 10);
    return true;
  } catch (error) {
    error.value = err.message || "Error desconocido al cargar el mod.";
    return false;
  }
};

onBeforeMount(async () => {
  const reponse = await fetchModsSlug(route.params.slug);
  if (!reponse) {
    Swal.fire({
      icon: "error",
      text: "Ocurrio un error",
    });
  }
});

onMounted(async () => {
  fetchOptionsDuracion();
  fetchOptionsEstado();
  fetchOptionsEnfoque();
});

const editDescription = async () => {
  if (infoMod.value.descripcion.trim() === "") {
    infoMod.value.descripcion = "No hay una descripción disponible";
  }
  fetchEdit(1, "change-description");
};

const fetchEdit = async (tipo, ruta) => {
  let bodyData = {};

  switch (tipo) {
    case 1:
      bodyData = { descripcion: infoMod.value.descripcion };
      break;
    case 2:
      bodyData = { estado: infoMod.value.estado };
      break;
    case 3:
      bodyData = { duracion: infoMod.value.duracion };
      break;
    case 4:
      bodyData = { enfoque: infoMod.value.personaje };
      break;
    case 5:
      bodyData = { creado: infoMod.value.created };
      break;
    case 6:
      bodyData = { NFSW: infoMod.value.isNSFW };
      break;
    case 7:
      bodyData = { link_pc: infoMod.value.pc };
      break;
    case 8:
      bodyData = { link_android: infoMod.value.android };
      break;
    default:
      return;
  }

  try {
    Swal.fire({
      title: "Editando mod",
      text: "Por favor, espera un momento",
      allowOutsideClick: false, // Evita el cierre al hacer clic fuera
      didOpen: () => {
        Swal.showLoading();
      },
    });
    ruta = ruta.toString();

    const response = await fetch(
      `https://api.dokidokispanish.club/mod/${infoMod.value.id}/${ruta}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    );

    Swal.close();
    const data = await response.json();
    if (data.message) {
      Swal.fire({
        title: "¡Correcto!",
        text: JSON.stringify(data.message),
        icon: "success",
        allowOutsideClick: false, // Evita el cierre al hacer clic fuera
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } else {
      Swal.fire({
        title: "Error al editar el mod.",
        text: JSON.stringify(data.error),
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Error",
      text: "Ha ocurrido un error al editar el mod: " + err,
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
};
document.title = "Editar Mod - Doki Doki Spanish Club";
</script>

<style scoped>
.formulario {
  width: 80%;
  margin-inline: auto;
  margin-top: 15dvh;
  margin-bottom: 2rem;
}
.formulario form {
  padding: 2rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
  gap: 1rem;
}

.formulario form .container_portada {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}
@media screen and (max-width: 768px) {
  .formulario form .container_portada {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.container_portada img {
  width: 100%;
  border-radius: 10px;
}
.container_portada .container_text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

input {
  font-size: 1rem;
  padding: 1rem;
}

.selected-items {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  border-radius: 10px;
  background: #fff;
  gap: 1rem;
}
.selected-items span {
  width: fit-content !important;
  position: relative !important;
  border: 2px solid var(--color_fondo);
  padding: 0.5rem;
  border-radius: 10px;
  bottom: 0 !important;
}
.preview-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.preview {
  width: 20rem;
  margin-inline: auto;
  display: flex;
  gap: 2rem;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  border-radius: 10px;
}
.preview img {
  border-radius: 10px;
  width: 100%;
  position: relative;
  z-index: 1;
  top: 0 !important;
  right: 0;
  aspect-ratio: 4/3;
  object-fit: contain;
}
.container_selectes {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
