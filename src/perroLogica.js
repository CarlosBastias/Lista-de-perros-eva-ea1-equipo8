// Funciones puras de la app (sin tocar el DOM), separadas para poder
// testearlas con Jest sin tener que simular todo el navegador.
// index.js importa estas funciones y se encarga solo de conectar
// los eventos de los botones con el DOM.

// Suma 1 al contador de likes o dislikes.
function incrementarContador(totalActual) {
  return totalActual + 1;
}

// Vuelve los contadores de likes/dislikes a cero (botón "Reiniciar").
function contadoresIniciales() {
  return { likes: 0, dislikes: 0 };
}

// Arma el texto que se muestra en pantalla, ej: "👍🏻 3"
function formatearContador(emoji, total) {
  return `${emoji} ${total}`;
}

// La API de dog.ceo responde { status: "success", message: "<url>" }
// cuando todo salió bien. Si no, hay que pedir otra foto.
function respuestaExitosa(jsonRes) {
  return Boolean(jsonRes) && jsonRes.status === "success";
}

// Esta es la función que corrige el bug del hotfix: si el usuario
// aprieta "Saltear" varias veces muy rápido, se disparan varias
// peticiones a la API al mismo tiempo. Cada petición se guarda con
// su propio id; cuando responde, se compara contra el id más
// reciente (requestId). Si ya no es el más reciente, la respuesta
// se descarta porque el usuario ya pidió otra foto después.
function esSolicitudVigente(idDeLaSolicitud, idMasReciente) {
  return idDeLaSolicitud === idMasReciente;
}

// Node (Jest) usa module.exports; el navegador simplemente ignora
// este bloque porque no existe "module" ahí, y las funciones quedan
// disponibles como variables globales del script.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    incrementarContador,
    contadoresIniciales,
    formatearContador,
    respuestaExitosa,
    esSolicitudVigente,
  };
}