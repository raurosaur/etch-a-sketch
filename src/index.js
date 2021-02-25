import domtoimage from "dom-to-image";

const container = document.querySelector("#container");
const input = document.querySelectorAll("input");
const randomColor = document.querySelector("#random-color");
const resetButton = document.querySelector("#reset");
const borders = document.querySelector("#borders");
const defBorder = "1px solid black";
const downloadButton = document.querySelector('#download');

let isRandom = false;
let hasBorder = true;
let draw = true;

//Reset
function reset() {
  container.innerHTML = "";
  const style = getComputedStyle(document.documentElement);
  for (let i = 0; i < style.getPropertyValue("--grid-size") ** 2; ++i) {
    container.innerHTML += '<div class = "grid"/>';
  }
}
reset();
//Random Color Generator
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//Paint Function
function paint({ target }) {
  if (isRandom)
    document.documentElement.style.setProperty("--color", getRandomColor());
  target.style.backgroundColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--color");
}

/***************Event Listener***************/
container.addEventListener("click", () => {
  const grids = document.querySelectorAll(".grid");
  grids.forEach((el) => {
    if (draw) el.addEventListener("mouseover", paint);
    else el.removeEventListener("mouseover", paint);
  });
  draw = !draw;
});

input.forEach((el) =>
  el.addEventListener("input", ({ target }) => {
    document.documentElement.style.setProperty(
      `--${target.name}`,
      target.value
    );
    if (target.name === "grid-size") reset();
  })
);

randomColor.addEventListener("click", ({ target }) => {
  isRandom = !isRandom;
  target.innerText = `Random Color: ${isRandom ? "On" : "Off"}`;
});

resetButton.addEventListener("click", reset);

borders.addEventListener("click", ({ target }) => {
  hasBorder = !hasBorder;
  target.innerText = `Border: ${hasBorder ? "On" : "Off"}`;
  document.documentElement.style.setProperty(
    "--outline",
    hasBorder ? defBorder : "none"
  );
});

downloadButton.addEventListener('click', () => {
  domtoimage.toPng(container)
  .then(dataUrl => {
    const date = new Date();
    const name = date.toDateString().split(' ').join('_'); 
    const link = document.createElement('a');
    link.download = `Image_${name}.png`;
    link.href = dataUrl;
    link.click();
  });
});

