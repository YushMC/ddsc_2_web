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
          <input type="text" v-model="descriptionMod" />
        </div>
        <div class="container_input">
          <label for="">Tipo: </label>
          <select name="" id="" v-model="tipoMod">
            <option value="1">Traducción</option>
            <option value="2">Mod Original</option>
          </select>
        </div>
        <div class="container_input">
          <label for="">Duración: </label>
          <select name="" id="" v-model="duracionMod">
            <option value="1">Argentina</option>
          </select>
        </div>
        <div class="container_input">
          <label for="">Enfoque: </label>
          <select name="" id="" v-model="enfoqueMod">
            <option value="1">Argentina</option>
          </select>
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
        <div class="container_input">
          <label for="">Link de descarga PC: </label>
          <input type="text" v-model="linkMod" />
        </div>
        <div class="container_input">
          <label for="">Link de descarga Android: </label>
          <input type="text" v-model="linkModAndroid" />
        </div>
        <div class="container_input">
          <label for="">Creador</label>
          <input list="list-users" id="users" v-model="creadorMod" />
          <datalist id="list-users">
            <option value="Manzana"></option>
            <option value="Banana"></option>
            <option value="Cereza"></option>
            <option value="Durazno"></option>
            <option value="Uva"></option>
          </datalist>
        </div>
        <div class="container_input">
          <label for="">Traductor</label>
          <input list="list-users-2" id="users-2" v-model="TraductorMod" />
          <datalist id="list-users-2">
            <option value="Manzana"></option>
            <option value="Banana"></option>
            <option value="Cereza"></option>
            <option value="Durazno"></option>
            <option value="Uva"></option>
          </datalist>
        </div>
        <h6 style="color: red">* Obligatorio</h6>

        <button type="submit" @click.prevent="registerUser">Crear</button>
      </div>
    </form>
  </div>
</template>

<script setup></script>

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
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.formulario form .container_portada {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
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
</style>
