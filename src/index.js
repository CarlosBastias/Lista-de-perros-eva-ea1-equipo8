const perroActualElement = document.getElementById("perroActual");
const spinner = document.getElementById("spinner");
const perrosLikeContainer = document.getElementById("perrosLikeContainer");
const perrosDislikeContainer = document.getElementById(
  "perrosDislikeContainer"
);
const contadorLikesElement = document.getElementById("contadorLikes");
const contadorDislikesElement = document.getElementById("contadorDislikes");
perrosLikeContainer.classList.toggle("escondido");
perrosDislikeContainer.classList.toggle("escondido");

let perroActual;
let totalLikes = 0;
let totalDislikes = 0;

document.getElementById("like").addEventListener("click", () => {
  rankearPerro("+");
});
document.getElementById("dislike").addEventListener("click", () => {
  rankearPerro("-");
});
document.getElementById("saltear").addEventListener("click", nuevoPerro);
document.getElementById("reiniciar").addEventListener("click", reiniciarHistorial);

// HOTFIX: se guarda un identificador de solicitud (requestId) para evitar que,
// si el usuario hace clic en "Saltear" varias veces muy rápido, una respuesta
// vieja de la API "gane la carrera" y deje el spinner o la imagen desincronizados.
// La validación de si una solicitud sigue vigente ahora vive en perroLogica.js
// (esSolicitudVigente) para poder testearla sin simular el navegador.
let requestId = 0;

perroActualElement.addEventListener("load", () => {
  spinner.classList.toggle("escondido", true);
  perroActualElement.classList.toggle("escondido", false);
});

function rankearPerro(ranking) {
  const nuevaImagen = document.createElement("img");
  nuevaImagen.src = perroActual;
  if (ranking === "+") {
    perrosLikeContainer.appendChild(nuevaImagen);
    perrosLikeContainer.classList.toggle("escondido", false);
    totalLikes = incrementarContador(totalLikes);
    contadorLikesElement.textContent = formatearContador("👍🏻", totalLikes);
  } else {
    perrosDislikeContainer.appendChild(nuevaImagen);
    perrosDislikeContainer.classList.toggle("escondido", false);
    totalDislikes = incrementarContador(totalDislikes);
    contadorDislikesElement.textContent = formatearContador("👎🏻", totalDislikes);
  }
  nuevoPerro();
}

function reiniciarHistorial() {
  perrosLikeContainer.innerHTML = "";
  perrosDislikeContainer.innerHTML = "";
  perrosLikeContainer.classList.toggle("escondido", true);
  perrosDislikeContainer.classList.toggle("escondido", true);
  const iniciales = contadoresIniciales();
  totalLikes = iniciales.likes;
  totalDislikes = iniciales.dislikes;
  contadorLikesElement.textContent = formatearContador("👍🏻", totalLikes);
  contadorDislikesElement.textContent = formatearContador("👎🏻", totalDislikes);
}

async function nuevoPerro() {
  const idDeEstaSolicitud = ++requestId; // HOTFIX: marca esta solicitud como la más reciente
  perroActualElement.classList.toggle("escondido", true);
  spinner.classList.toggle("escondido", false);
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const jsonRes = await res.json();

  // HOTFIX: si llegó una solicitud más nueva mientras esperábamos esta respuesta,
  // se descarta el resultado actual para no pisar la imagen/spinner correctos.
  if (!esSolicitudVigente(idDeEstaSolicitud, requestId)) return;

  if (respuestaExitosa(jsonRes)) {
    perroActual = jsonRes.message;
    perroActualElement.src = perroActual;
  } else {
    nuevoPerro();
  }
}

//Ejecución
nuevoPerro();