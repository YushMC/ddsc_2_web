<template>
  <div class="estructura2">
    <div class="frontPage">
      <div class="text">
        <h1>¡Hola, Bienvenidos a nuestro club!</h1>
        <h3 class="subtitulo">
          La mayor biblioteca pública de mods en español!
        </h3>
        <div class="content_buttons">
          <a
            href="https://www.dokidokispanish.club/"
            target="_blank"
            id="clasico"
            ><i class="bi bi-arrow-return-left"></i> Sitio Clásico</a
          >
          <a
            href="https://launcher.dokidokispanish.club/"
            id="external"
            target="_blank"
            >DDLC Launcher <i class="bi bi-box-arrow-up-right"></i
          ></a>
        </div>
      </div>
      <picture>
        <img
          src="https://www.dokidokispanish.club/assets/gui/Logo_DDSC.png"
          alt=""
        />
      </picture>
    </div>
    <div class="contentCards_info">
      <div class="card">
        <span style="color: var(--color_fondo)">
          <i class="bi bi-archive-fill"></i>
        </span>
        <h2>
          <span>{{ totalMods }}</span> Mods guardados en nuestra base de datos
        </h2>
      </div>

      <div class="card">
        <span style="color: var(--color_fondo)">
          <i class="bi bi-code-slash"></i>
        </span>
        <h2>Interfaz, funciones y mejor construcción web</h2>
      </div>

      <div class="card">
        <span style="color: var(--color_fondo)">
          <i class="bi bi-database"></i>
        </span>
        <h2>Base de datos mejorada.</h2>
      </div>
      <div class="card">
        <span style="color: var(--color_fondo)">
          <i class="bi bi-person-badge"></i>
        </span>
        <h2>Mejor sistema de cuentas de usuario.</h2>
        <h6>* en construcción</h6>
      </div>
      <div class="card">
        <span style="color: var(--color_fondo)">
          <i class="bi bi-people-fill"></i>
        </span>
        <h2>Sistema de comunidad.</h2>
        <h6>* en construcción</h6>
      </div>
      <div class="card">
        <span style="color: var(--color_fondo)">
          <i class="bi bi-patch-plus-fill"></i>
        </span>
        <h2>
          <span>{{ totalUploaders }}</span> ¡Personas subiendo mods!
        </h2>
      </div>
    </div>
    <ContentCards :solicitud="7"></ContentCards>
    <div class="content_Cards_team">
      <h1>
        <span><i class="bi bi-cup-hot-fill"></i></span> ¡Conoce a nuestro equipo
        de trabajo!
      </h1>
      <div class="container_cards_team">
        <div class="cards_team" v-for="person in listPerson" :key="person.id">
          <picture>
            <img :src="person.url_logo" alt="" />
          </picture>
          <article>
            <h2>{{ person.nombre }}</h2>
            <h5>{{ person.rol }}</h5>
          </article>
        </div>
      </div>
    </div>
    <!-- 
    <ContentCards :solicitud="1"></ContentCards>
    <ContentCards :solicitud="2"></ContentCards>
    <ContentCards :solicitud="3"></ContentCards>
    <ContentCards :solicitud="4"></ContentCards>
    -->
  </div>
</template>

<script setup>
import ContentCards from "../components/ContentCards.vue";
import { onMounted, ref } from "vue";
import { useHeaderComposable } from "../composables/useHeader";
const { isMenuResponsive } = useHeaderComposable();

const totalMods = ref(0);
const totalUploaders = ref(0);

const listPerson = ref([]);
const fetchInfo = async () => {
  try {
    const response = await fetch("https://api.dokidokispanish.club/total-mods");
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const jsonData = await response.json();
    totalMods.value = jsonData.total_rows || [];
  } catch (error) {}

  try {
    const response2 = await fetch(
      "https://api.dokidokispanish.club/total-uploaders"
    );
    if (!response2.ok) {
      throw new Error(`Error HTTP: ${response2.status}`);
    }
    const jsonData = await response2.json();
    totalUploaders.value = jsonData.total_rows || [];
  } catch (error) {}
};

const fetchInfoTeam = async () => {
  try {
    const response = await fetch(
      "https://api.dokidokispanish.club/users/team-ddsc"
    );
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const jsonData = await response.json();
    listPerson.value = jsonData.results || [];
  } catch (error) {}
};

onMounted(async () => {
  isMenuResponsive.value = false;
  await fetchInfo();
  await fetchInfoTeam();
});
</script>

<style scoped>
.estructura2 {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}
.frontPage {
  width: 100%;
  display: grid;
  background-image: url("https://www.dokidokispanish.club/assets/gui/banner_inicio.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  margin: 0;
  border-bottom: solid 10px var(--color_fondo);
}

.text {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--color_fondo_transparente);
  backdrop-filter: blur(10px);
  padding-left: 10%;
  padding-top: 10%;
  padding-bottom: 10%;
  color: #fff;
}

.frontPage picture {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 10%;
  padding-top: 10%;
  padding-bottom: 10%;
  background: rgba(0, 0, 0, 0.2);
}
.frontPage img {
  width: 80%;
  aspect-ratio: 1/1;
  filter: drop-shadow(-1px 4px 10px #727272);
}

.subtitulo {
  font-weight: 300;
  padding-bottom: 0.5rem;
  border-bottom: solid 2px #fff;
}
.content_buttons {
  width: 100%;
  display: flex;
  gap: 1rem;
  justify-content: space-evenly;
  align-items: center;
}

.content_buttons #external {
  background: green;
}
.content_buttons #clasico {
  background: rgb(65, 64, 64);
}

.contentCards_info {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  padding-inline: 10%;
  padding-block: 5%;
}

.contentCards_info .card {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.644);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contentCards_info .card span {
  font-size: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contentCards_info .card h2 {
  text-wrap: balance;
  text-align: center;
  font-weight: 500;
}
.contentCards_info .card h2 span {
  font-size: 2rem;
  color: var(--color_fondo);
}

.contentCards_info .card h6 {
  color: rgb(214, 28, 28);
  text-align: end;
  font-weight: 500;
}

.content_Cards_team {
  padding-inline: 10%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-block: 5%;
}

.content_Cards_team h1 {
  width: fit-content;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.644);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.content_Cards_team h1 span {
  color: var(--color_fondo);
  font-size: 2rem;
}

.container_cards_team {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.cards_team {
  width: 100%;
  gap: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 1rem;
  background: rgba(255, 255, 255, 0.644);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.cards_team picture {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cards_team picture img {
  width: 50%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 100%;
}

@media screen and (max-width: 800px) {
  .container_cards_team {
    display: flex;
    flex-direction: column;
  }
  .cards_team {
    grid-template-columns: 1fr 3fr;
  }
  .frontPage {
    display: flex;
    flex-direction: column;
  }
  .text {
    padding-right: 10%;
  }

  .frontPage picture {
    display: none;
  }
}
</style>
