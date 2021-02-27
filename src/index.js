import domtoimage from "dom-to-image";

const container = document.querySelector("#container");
const input = document.querySelectorAll("input");
const randomColor = document.querySelector("#random-color");
const resetButton = document.querySelector("#reset");
const borders = document.querySelector("#borders");
const defBorder = "1px solid black";
const downloadButton = document.querySelector("#download");
const floodFillButton = document.querySelector("#flood-fill");

let numGrids = 16;
let isRandom = false;
let hasBorder = true;
let draw = true;
let fillOn = false;
//Reset
function reset() {
  container.innerHTML = "";
  console.log(numGrids);
  for (let i = 0, j = 0; i < numGrids * numGrids; ++i) {
    const div = document.createElement("div");
    div.setAttribute("id", `${Math.floor(j)}-${i % numGrids}`);
    div.setAttribute("tabindex", i + 1);
    div.className += "grid";
    container.appendChild(div);
    j += 1 / numGrids;
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
    if (fillOn) {
      const [x, y] = target.id.split("-");
      const targetCol = getComputedStyle(target).backgroundColor;
      const color = getComputedStyle(document.documentElement).getPropertyValue(
        "--color"
      );
      floodfill(+x, +y, targetCol, color);
    } else if (draw) {
      target.style.backgroundColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--color");
      target.parentElement.addEventListener("mouseover", paint);
    } else target.parentElement.removeEventListener("mouseover", paint);
  }
  draw = !draw;
}
//Flood fill
function floodfill(x, y, target, newCol) {
  if(x < 0 || y < 0 || x > numGrids || x > numGrids) return;
  const cell = document.getElementById(`${x}-${y}`);

  const col = getComputedStyle(cell).backgroundColor;
  if (col !== target ) return;
  cell.style.backgroundColor = newCol;
  floodfill(x,y+1,target, newCol);
  floodfill(x,y-1,target, newCol);
  floodfill(x+1,y,target, newCol);
  floodfill(x-1,y,target, newCol);
}

/***************Event Listener***************/
container.addEventListener("click", togglePaint);

/*
//Mobile Touch Accessibility
container.addEventListener('touchstart', () => {
  container.addEventListener('touchmove', paint);
});
container.addEventListener('touchend', () => {
  container.removeEventListener('touchmove', paint);
});
container.addEventListener("keydown", (event) => {
  if (event.key === "Enter") paint(event);
});
*/

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
  const span = target.querySelector("span");
  span.innerText = isRandom ? "On" : "Off";
  span.classList.toggle("off");
  span.classList.toggle("on");
});

resetButton.addEventListener("click", reset);

borders.addEventListener("click", ({ target }) => {
  hasBorder = !hasBorder;
  const span = target.querySelector("span");
  span.innerText = hasBorder ? "On" : "Off";
  span.classList.toggle("off");
  span.classList.toggle("on");
  document.documentElement.style.setProperty(
    "--outline",
    hasBorder ? defBorder : "none"
  );
});

floodFillButton.addEventListener("click", ({ target }) => {
  fillOn = !fillOn;
  const span = target.querySelector("span");
  span.innerText = fillOn ? "On" : "Off";
  span.classList.toggle("off");
  span.classList.toggle("on");
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

window.addEventListener('click', () => {
});

// if(window.innerWidth <= 900){
//   document.querySelectorAll('button').forEach(el => el.innerHTML = "");
// }
