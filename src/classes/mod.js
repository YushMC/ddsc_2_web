export class Mod {
  constructor({
    id = 0,
    nombre = "",
    descripcion = "",
    duracion = "",
    estado = "",
    personaje = "",
    isNSFW = 0,
    slug = "",
    created = "",
    visitas = 0,
    generos = [],
    creadores = [],
    traductores = [],
    logo = null, // Puede ser string o File
    capturas = [], // Array de archivos
    portada = null, // Puede ser string o File
    pc = "",
    android = "",
  } = {}) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.duracion = duracion;
    this.estado = estado;
    this.personaje = personaje;
    this.isNSFW = isNSFW;
    this.slug = slug;
    this.created = created;
    this.visitas = visitas;
    this.generos = generos;
    this.creadores = creadores;
    this.traductores = traductores;
    this.logo = logo;
    this.capturas = capturas;
    this.portada = portada;
    this.pc = pc;
    this.android = android;
  }
}
