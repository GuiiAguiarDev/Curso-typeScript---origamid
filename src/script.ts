import Slide from "./Slide.js";

const container = document.getElementById("slide");
//selecionando o array
//´pega os filhos dependentes idpendente de ser foto video imagem e etc
const elements = document.getElementById("slide-elements");
const controls = document.getElementById("slide-controls");

//todos os filhos
if (container && elements && controls && elements.children.length) {
  const slide = new Slide(
    container,
    Array.from(elements.children),
    controls,
    3000
  );

}
