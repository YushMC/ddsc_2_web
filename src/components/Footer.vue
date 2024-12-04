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
      <div>
        <a href="">discord</a>
      </div>
    </div>
    <div>
      <h3>© Doki Doki Spanish Club 2019 - 2024</h3>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
footer {
  display: flex;
  flex-direction: column;
  background: #e726ee52;
  backdrop-filter: blur(10px);
  position: relative;
  bottom: 0;
}
.container_footer {
  max-width: 1000px;
  width: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  background: #e726ee;
  color: #fff;
}
</style>
