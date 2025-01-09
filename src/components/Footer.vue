<template>
  <footer>
    <div class="container_footer">
      <div>
        <img
          src="https://www.dokidokispanish.club/assets/gui/Logo_DDSC.png"
          alt=""
        />
        <h2>Team DDSC Web</h2>
      </div>
      <div>
        <p>
          ¡Todo el contenido es gratis! Y no genera ningún ingreso.. No afiliado
          al Team Salvato!<br />
          No somos dueños del material artístico e intelectual y solo se utiliza
          con fines informativos, créditos a sus respectivos autores.
        </p>
      </div>
    </div>
    <div>
      <h3>© Doki Doki Spanish Club 2019 - 2025</h3>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
footer {
  display: flex;
  flex-direction: column;
  background: #a610ac52;
  backdrop-filter: blur(10px);
  position: relative;
  bottom: 0;
}
.container_footer {
  max-width: 1000px;
  width: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2%;
}
.container_footer div:first-child {
  display: grid;
  grid-template-columns: 1fr 4fr;
  align-items: center;
}
.container_footer div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_footer div img {
  width: 100%;
}
footer > div:last-child {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1% 0;
  background: #a610ac;
  color: #fff;
}
@media screen and (max-width: 600px) {
  .container_footer {
    display: flex;
    flex-direction: column;
    padding: 5%;
  }
  .container_footer div:first-child {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .container_footer div:first-child img {
    width: 3rem;
  }
  .container_footer div:last-child {
    display: none;
  }
  .container_footer p {
    font-size: 0.5rem;
  }
}
</style>
