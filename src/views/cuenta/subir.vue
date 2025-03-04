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
          <h1>Subir Mod</h1>
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
          <input type="text" v-model="nameMod" />
        </div>
        <div class="container_input">
          <label for="">Descripción: </label>
          <h6
            :style="{ color: descriptionMod.length > 1000 ? 'red' : 'black' }"
          >
            Carateres usados: {{ descriptionMod.length }}/ 1000
          </h6>
          <textarea type="text" v-model="descriptionMod" rows="10" cols="10">
          </textarea>
        </div>
        <div class="container_input">
          <label for="">Tipo: </label>
          <select name="" id="" v-model="tipoMod">
            <option value="1">Traducción</option>
            <option value="2">Mod Original</option>
          </select>
        </div>
        <div class="container_input">
          <label for="">Estado: </label>
          <select name="" id="" v-model="estadoMod">
            <option
              v-for="option in optionsEstado"
              :key="option?.id"
              :value="option?.id"
            >
              {{ option?.estado }}
            </option>
          </select>
        </div>
        <div class="container_input">
          <label for="">Duración: </label>
          <select name="" id="" v-model="duracionMod">
            <option
              v-for="option in optionsDuracion"
              :key="option?.id"
              :value="option?.id"
            >
              {{ option?.duracion }}
            </option>
          </select>
        </div>

        <div class="container_input">
          <label for="">Enfoque: </label>
          <select name="" id="" v-model="enfoqueMod">
            <option
              value="1"
              v-for="option in optionsEnfoque"
              :key="option?.id"
              :value="option?.id"
            >
              {{ option?.enfoque }}
            </option>
          </select>
        </div>
        <div
          class="container_input"
          :class="{ options: selectedOptionsGenero.length > 0 }"
        >
          <label for="">Generos: </label>
          <select v-model="selectedValueGenero" @change="addOptionGenero">
            <option value="" disabled>Seleccione un género</option>
            <option
              v-for="option in optionsGenero"
              :key="option?.id"
              :value="option?.id"
            >
              {{ option?.genero }}
            </option>
          </select>
          <label for="" v-if="selectedOptionsGenero.length > 0"
            >Generos seleccionados:</label
          >
          <div class="selected-items" v-if="selectedOptionsGenero.length > 0">
            <span
              v-for="option in selectedOptionsGenero"
              :key="option.id"
              class="tag"
            >
              {{ option.genero }}
              <button @click="removeOptionGenero(option)">✖</button>
            </span>
          </div>
        </div>
        <div class="container_input" v-if="estadoMod !== 3">
          <label for="">Fecha de lanzamiento: </label>
          <input type="date" v-model="fechaMod" />
        </div>
        <div class="container_input">
          <label for=""
            >Contiene escenas +18 o no aptas para todo el público:
          </label>
          <select name="" id="" v-model="nsfwMod">
            <option value="0">No</option>
            <option value="1">Sí</option>
          </select>
        </div>
        <div class="container_input" v-if="estadoMod !== 3">
          <label for="">Link de descarga PC: </label>
          <input type="text" v-model="linkMod" />
        </div>
        <div class="container_input" v-if="estadoMod !== 3">
          <label for="">Link de descarga Android: </label>
          <input type="text" v-model="linkModAndroid" />
        </div>
        <div
          class="container_input"
          :class="{ options: selectedValueCreador.length > 0 }"
        >
          <h6>
            Nota: Selecciona una opción o escribe el nombre del creador (en caso
            de no estar en la lista)
          </h6>
          <label for="">Creador</label>

          <input
            list="options-list"
            v-model="selectedValueCreador"
            @change="addOptionCreador"
            placeholder="Selecciona una opción o escribe el nombre del creador (en caso de no estar en la lista)"
          />
          <datalist id="options-list">
            <option
              v-for="option in optionsCreadores"
              :key="option?.id"
              :value="option?.nombre"
            ></option>
          </datalist>
          <label for="" v-if="selectedOptions.length > 0"
            >Creadores seleccionados:</label
          >
          <div class="selected-items" v-if="selectedOptions.length > 0">
            <span v-for="option in selectedOptions" :key="option" class="tag">
              {{ option.nombre }}
              <button @click="removeOption(option)">✖</button>
            </span>
          </div>
        </div>
        <div
          class="container_input"
          v-if="isTraduccion"
          :class="{ options: selectedValueTraductor.length > 0 }"
        >
          <h6>
            Nota: Selecciona una opción o escribe el nombre del traductor (en
            caso de no estar en la lista)
          </h6>
          <label for="">Traductor</label>
          <input
            list="options-list-traductores"
            v-model="selectedValueTraductor"
            @change="addOptionTraductor"
            placeholder="Selecciona una opción o escribe el nombre del creador (en caso de no estar en la lista)"
          />
          <datalist id="options-list-traductores">
            <option
              v-for="opcion in optionsTraductores"
              :key="opcion.id"
              :value="opcion.nombre"
            ></option>
          </datalist>

          <label for="" v-if="selectedOptionsTraductor.length > 0"
            >Traductores seleccionados:</label
          >
          <div
            class="selected-items"
            v-if="selectedOptionsTraductor.length > 0"
          >
            <span
              v-for="opcion in selectedOptionsTraductor"
              :key="opcion.id"
              class="tag"
            >
              {{ opcion.nombre }}
              <button @click="removeOptionTraductor(opcion)">✖</button>
            </span>
          </div>
        </div>
        <div
          class="container_input"
          :class="{ options: selectedFile !== null }"
        >
          <label for="">Logo</label>
          <input
            type="file"
            ref="logo"
            @change="handleFileChange"
            accept="image/*"
            required
          />
          <div v-if="selectedFile" class="preview">
            <img :src="selectedFile" alt="Vista previa de la imagen" />
            <button @click.prevent="clearImage">Eliminar</button>
          </div>
        </div>
        <div
          class="container_input"
          :class="{ options: selectedFilePortada !== null }"
        >
          <label for="">Portada</label>
          <input
            type="file"
            ref="portada"
            accept="image/*"
            required
            @change="handleFileChangePortada"
          />
          <div v-if="selectedFilePortada" class="preview">
            <img :src="selectedFilePortada" alt="Vista previa de la imagen" />
            <button @click.prevent="clearImagePortada">Eliminar</button>
          </div>
        </div>
        <div class="container_input">
          <label for="">Capturas</label>
          <input
            type="file"
            ref="capturas"
            @change="handleFileChangeCapturas"
            accept="image/*"
            multiple
            required
          />
          <div class="preview-container" v-if="imagePreviews.length">
            <div
              v-for="(image, index) in imagePreviews"
              :key="index"
              class="preview"
            >
              <img :src="image.url" alt="Vista previa" class="preview-img" />
              <button @click.prevent="removeImageCapturas(index)">
                Eliminar
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          style="width: 100% !important"
          @click.prevent="registerMod"
        >
          Subir Información
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useInfoToken } from "../../composables/useInfoToken";
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";

const nameMod = ref("");
const descriptionMod = ref("");
const tipoMod = ref(1);
const duracionMod = ref(1);
const enfoqueMod = ref(1);
const nsfwMod = ref(0);
const linkMod = ref("");
const linkModAndroid = ref("");
const fechaMod = ref("");

const logo = ref(null);
const selectedFile = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = URL.createObjectURL(file);
  }
};

const clearImage = () => {
  if (logo.value) {
    logo.value.value = ""; // 🔥 Limpia el input file
  }
  selectedFile.value = null;
};

const capturas = ref([]);

const imagePreviews = ref([]); // Lista de imágenes seleccionadas

const handleFileChangeCapturas = (event) => {
  const files = Array.from(event.target.files);
  updateImagesCapturas(files);
};

// Función para actualizar la lista de imágenes
const updateImagesCapturas = (files) => {
  files.forEach((file) => {
    imagePreviews.value.push({
      file,
      url: URL.createObjectURL(file),
    });
  });

  // Sincronizar archivos en el input
  syncInputFilesCapturas();
};

// Eliminar una imagen de la lista
const removeImageCapturas = (index) => {
  imagePreviews.value.splice(index, 1);
  syncInputFiles(); // Sincronizar después de eliminar
};

// Función para sincronizar archivos con el input
const syncInputFiles = () => {
  const dataTransfer = new DataTransfer();
  imagePreviews.value.forEach((img) => dataTransfer.items.add(img.file));
  capturas.value.files = dataTransfer.files; // Actualiza los archivos del input
};

const portada = ref(null);
const selectedFilePortada = ref(null);

const handleFileChangePortada = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFilePortada.value = URL.createObjectURL(file);
  }
};

const clearImagePortada = () => {
  if (portada.value) {
    portada.value.value = ""; // 🔥 Limpia el input file
  }
  selectedFilePortada.value = null;
};

const isTraduccion = ref(true);
const estadoMod = ref(1);

watch(tipoMod, (newValue) => {
  isTraduccion.value = !isTraduccion.value;
});

const optionsCreadores = ref([]); // Almacena las opciones de la API
const selectedOptions = ref([]); // Almacena las opciones seleccionadas
const selectedValueCreador = ref("");

const optionsTraductores = ref([]); // Almacena las opciones de la API
const selectedOptionsTraductor = ref([]); // Almacena las opciones seleccionadas
const selectedValueTraductor = ref("");

const fetchOptions = async () => {
  try {
    const response = await fetch("https://api.dokidokispanish.club/users"); // Cambia por tu URL
    const data = await response.json();
    optionsCreadores.value = data.results; // Suponiendo que la API devuelve un array de strings
    optionsTraductores.value = data.results; // Suponiendo que la API devuelve un array de strings
  } catch (error) {
    console.error("Error al obtener opciones:", error);
  }
};

const removeOption = (option) => {
  selectedOptions.value = selectedOptions.value.filter(
    (item) => item !== option
  );
};
const addOptionCreador = () => {
  if (!selectedValueCreador.value) return; // Evita valores vacíos

  // Buscar si el nombre ingresado está en la lista de opciones
  const selectedTraductor = optionsCreadores.value.find(
    (opcion) => opcion.nombre === selectedValueCreador.value
  );

  // Si está en la lista, usar el objeto completo; si no, crear uno nuevo
  const newTraductor = selectedTraductor || {
    id: Date.now(),
    nombre: selectedValueCreador.value,
  };

  // Evitar duplicados
  if (
    !selectedOptions.value.some(
      (opcion) => opcion.nombre === newTraductor.nombre
    )
  ) {
    selectedOptions.value.push(newTraductor);
  }

  selectedValueCreador.value = ""; // Limpiar el input
};

const addOptionTraductor = () => {
  if (!selectedValueTraductor.value) return; // Evita valores vacíos

  // Buscar si el nombre ingresado está en la lista de opciones
  const selectedTraductor = optionsTraductores.value.find(
    (opcion) => opcion.nombre === selectedValueTraductor.value
  );

  // Si está en la lista, usar el objeto completo; si no, crear uno nuevo
  const newTraductor = selectedTraductor || {
    id: Date.now(),
    nombre: selectedValueTraductor.value,
  };

  // Evitar duplicados
  if (
    !selectedOptionsTraductor.value.some(
      (opcion) => opcion.nombre === newTraductor.nombre
    )
  ) {
    selectedOptionsTraductor.value.push(newTraductor);
  }

  selectedValueTraductor.value = ""; // Limpiar el input
};

const removeOptionTraductor = (option) => {
  selectedOptionsTraductor.value = selectedOptionsTraductor.value.filter(
    (item) => item !== option
  );
};
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

const addOptionGenero = () => {
  if (!selectedValueGenero.value) return; // Evita valores vacíos

  // Convertir a número si es necesario
  const selectedId = parseInt(selectedValueGenero.value, 10);

  // Buscar en la lista de opciones
  const selectedGenero = optionsGenero.value.find(
    (opcion) => opcion.id === selectedId
  );

  if (!selectedGenero) return; // Evitar problemas si no se encuentra

  // Verificar si ya existe en la lista seleccionada
  if (
    !selectedOptionsGenero.value.some(
      (opcion) => opcion.id === selectedGenero.id
    )
  ) {
    selectedOptionsGenero.value.push(selectedGenero);
  }

  selectedValueGenero.value = ""; // Reiniciar selección
};

const removeOptionGenero = (option) => {
  selectedOptionsGenero.value = selectedOptionsGenero.value.filter(
    (item) => item.id !== option.id
  );
};

onMounted(() => {
  fetchOptions();
  fetchOptionsDuracion();
  fetchOptionsEstado();
  fetchOptionsEnfoque();
  fetchOptionsGenero();
});

const registerMod = async () => {
  const formData = new FormData();
  if (
    nameMod.value.trim() === "" ||
    descriptionMod.value.trim() === "" ||
    selectedOptions.length === 0 ||
    selectedOptionsTraductor.length === 0 ||
    selectedOptionsGenero.length === 0
  ) {
    Swal.fire({
      title: "Error",
      text: "Por favor, rellena o selecciona todos los campos.",
      icon: "error",
    });
    return false;
  }

  // Agregar los datos del formulario al FormData
  formData.append("name", nameMod.value);
  formData.append("descripcion", descriptionMod.value);
  formData.append("tipo", tipoMod.value);
  formData.append("duracion", duracionMod.value);
  formData.append("enfoque", enfoqueMod.value);
  formData.append("estado", estadoMod.value);
  formData.append("nsfw", nsfwMod.value);
  formData.append("linkPC", linkMod.value);
  formData.append("linkAndroid", linkModAndroid.value);
  if (fechaMod.value.trim() !== "") {
    formData.append("fecha", fechaMod.value);
  }

  // Agregar opciones seleccionadas
  formData.append("creador", JSON.stringify(selectedOptions.value)); // Asegúrate de que sea un array
  formData.append("traductor", JSON.stringify(selectedOptionsTraductor.value)); // Asegúrate de que sea un array
  formData.append("generos", JSON.stringify(selectedOptionsGenero.value)); // Asegúrate de que sea un array

  // Obtener y agregar el archivo del logo
  const logoFile = logo.value.files[0];
  if (logoFile) {
    formData.append("logo", logoFile);
  }

  const portadaFile = portada.value.files[0];
  if (portadaFile) {
    formData.append("portada", portadaFile);
  }

  // Obtener y agregar los archivos de las capturas
  const captureFiles = capturas.value.files;
  for (let i = 0; i < captureFiles.length; i++) {
    formData.append("capturas[]", captureFiles[i]);
  }

  try {
    Swal.fire({
      title: "Creando mod",
      text: "Por favor, espera un momento",
      allowOutsideClick: false, // Evita el cierre al hacer clic fuera
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await fetch("https://api.dokidokispanish.club/add-mod", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    Swal.close();
    const data = await response.json();
    if (data.message) {
      nameMod.value = "";
      descriptionMod.value = "";
      tipoMod.value = 1;
      duracionMod.value = 1;
      enfoqueMod.value = 1;
      estadoMod.value = 1;
      nsfwMod.value = 0;
      linkMod.value = "";
      linkModAndroid.value = "";
      selectedOptions.value = [];
      selectedOptionsTraductor.value = [];
      selectedOptionsGenero.value = [];

      portada.value.value = "";

      logo.value.value = "";

      capturas.value.files = "";
      Swal.fire({
        title: "Mod Guardado!",
        text: JSON.stringify(data.message),
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "Error al guardar el mod.",
        text: JSON.stringify(data.error),
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Error",
      text: "Ha ocurrido un error al crear el mod: " + err,
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
};
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
  width: 48%;
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
}
</style>
