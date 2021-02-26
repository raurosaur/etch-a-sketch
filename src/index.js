import domtoimage from "dom-to-image";
const container = document.querySelector("#container");
const input = document.querySelectorAll("input");
const randomColor = document.querySelector("#random-color");
const resetButton = document.querySelector("#reset");
const borders = document.querySelector("#borders");
const defBorder = "1px solid black";
const downloadButton = document.querySelector("#download");

let numGrids = 16;
let isRandom = false;
let hasBorder = true;
let draw = true;

//Reset
function reset() {
  container.innerHTML = "";
  for (let i = 0; i < numGrids * numGrids; ++i) {
    const div = document.createElement("div");
    div.setAttribute("tabindex", i + 1);
    div.className += "grid";
    container.appendChild(div);
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

//togglePaint
function togglePaint({ target }) {
  if (target.className === "grid") {
    if (draw) {
      target.style.backgroundColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--color");
      target.parentElement.addEventListener("mouseover", paint);
    } else target.parentElement.removeEventListener("mouseover", paint);
  }
  draw = !draw;
}
/***************Event Listener***************/
container.addEventListener("click", togglePaint);
container.addEventListener("keydown", (event) => {
  if (event.key === "Enter") paint(event);
});

input.forEach((el) =>
  el.addEventListener("input", ({ target }) => {
    document.documentElement.style.setProperty(
      `--${target.name}`,
      target.value
    );
    if (target.name === "grid-size") {
      numGrids = target.value;
      reset();
    }
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

downloadButton.addEventListener("click", () => {
  domtoimage.toPng(container).then((dataUrl) => {
    const date = new Date();
    const name = date.toDateString().split(" ").join("_");
    const link = document.createElement("a");
    link.download = `Image_${name}.png`;
    link.href = dataUrl;
    link.click();
  });
});
