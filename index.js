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
perroActualElement.addEventListener("load", () => {
  spinner.classList.toggle("escondido", true);
  perroActualElement.classList.toggle("escondido", false);
});

function rankearPerro(ranking) {
  const nuevaImagen = document.createElement("img");
  nuevaImagen.src = perroActual;
  if (ranking === "+") {
    perrosLikeContainer.appendChild(nuevaImagen);
    perrosLikeContainer.classList.toggle("escondido",false)
    totalLikes++;
    contadorLikesElement.textContent = `👍🏻 ${totalLikes}`;
  } else {
    perrosDislikeContainer.appendChild(nuevaImagen);
    perrosDislikeContainer.classList.toggle("escondido",false)
    totalDislikes++;
    contadorDislikesElement.textContent = `👎🏻 ${totalDislikes}`;
  }
  nuevoPerro();
}

function reiniciarHistorial() {
  perrosLikeContainer.innerHTML = "";
  perrosDislikeContainer.innerHTML = "";
  perrosLikeContainer.classList.toggle("escondido", true);
  perrosDislikeContainer.classList.toggle("escondido", true);
  totalLikes = 0;
  totalDislikes = 0;
  contadorLikesElement.textContent = `👍🏻 ${totalLikes}`;
  contadorDislikesElement.textContent = `👎🏻 ${totalDislikes}`;
}

async function nuevoPerro() {
  perroActualElement.classList.toggle("escondido", true);
  spinner.classList.toggle("escondido", false);
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const jsonRes = await res.json();
  if (jsonRes.status === "success") {
    perroActual = jsonRes.message;
    perroActualElement.src = perroActual;
  } else {
    nuevoPerro();
  }
}

//Ejecución
nuevoPerro();