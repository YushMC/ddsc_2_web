<template>
  <header>
    <div class="notificaciones_header">
      <h1>Hola</h1>
    </div>
    <div class="container_header">
      <div class="container_sitio">
        <img src="" alt="" />
        <h1>Doki Doki Spanish Club</h1>
      </div>
      <nav>
        <div class="enlaces">
          <a href="">DDLC</a>
        </div>
        <div class="enlaces">
          <a href="">Inicio</a>
        </div>
        <div class="enlaces">
          <a href="">Traducciones</a>
          <div class="submenu">
            <a href="">Hola</a>
          </div>
        </div>
        <div class="enlaces">
          <a href="">Mods</a>
          <div class="submenu">
            <a href="">Hola</a>
          </div>
        </div>
        <div class="enlaces">
          <a href="">Comunidad</a>
          <div class="submenu">
            <a href="">Hola</a>
          </div>
        </div>
      </nav>
      <div class="container_buttons_header">
        <a href="">Cuenta</a>
      </div>
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  background: #2c2757ce;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1% 0;
  z-index: 100;
  box-shadow: 0px 0px 10px 5px rgba(255, 255, 255, 0.2);
  padding: 0;
  margin: 0;
}
.notificaciones_header {
  width: 100%;
  background: #e726ee;
  height: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.notificaciones_header h1 {
  font-size: 1.2rem;
  color: #fff;
}
.container_header {
  max-width: 1000px;
  width: 100%;
  height: 50%;
  margin: auto;
  display: grid;
  grid-template-columns: 2fr 3fr 1fr;
  gap: 5%;
  align-items: center;
  padding: 1% 0;
}
.container_sitio {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container_sitio h1 {
  font-size: 1rem;
}
nav {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2%;
  align-items: center;
}
nav .enlaces {
  width: 100%;
  display: flex;
  flex-direction: column;
}
nav .enlaces a {
  width: 100%;
  text-decoration: none;
  color: #fff;
  font-size: 0.9rem;
  padding: 2%;
  border-radius: 5px;
  text-align: center;
}
.enlaces .submenu {
  position: absolute;
  top: 90%;
  display: flex;
  flex-direction: column;
  text-wrap: nowrap;
  border-radius: 10px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s linear;
  padding: 1% 2%;
  background: cadetblue;
  z-index: 95 !important;
}
.enlaces:hover .submenu {
  opacity: 1;
  visibility: visible;
}
.submenu::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -20%;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 40px solid cadetblue;
  padding: 2%;
  scale: 0.5;
  z-index: 90 !important;
}
.container_buttons_header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_buttons_header a {
  padding: 1% 4%;
  color: #fff;
  text-decoration: none;
  background: #000;
  border-radius: 5px;
}
</style>
