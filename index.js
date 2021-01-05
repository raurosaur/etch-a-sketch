const container = document.getElementById('container'),
resetButton = document.querySelector('.reset'),
colorSelector = document.getElementById('colorSelector'),
numOfBlocks = document.getElementById('number-grids'),
randomColor = document.getElementById('random-color');

let color = '#000', numBlock = 16, isRandom = false;

function reset(){
    container.innerHTML = '';
    let i = 0;
    console.log(numBlock);
    while (i < numBlock * numBlock){
        const block = document.createElement('div');
        block.classList.add('blocks');
        container.appendChild(block);
        i++;
    }
}
reset();

function getRandomColor(){
    return Math.floor(Math.random() * 360);
}

container.addEventListener('mousemove', (event) => {
    if(isRandom){
        color = `hsl(${getRandomColor()}, 100%, 50%)`;
    }
    event.target.style.background = color;
});

colorSelector.addEventListener('input', (event) => {
    color = event.target.value;
});

numOfBlocks.addEventListener('input', (event) => {
    numBlock = event.target.value;
    reset();
});

randomColor.addEventListener('input', (event) => {
    if(randomColor.checked){
        isRandom = true;
    }
    else{
        isRandom = false;
        color = '#000';
    }
});

resetButton.addEventListener('click', reset);
