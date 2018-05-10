//Global Variables
const spaces = document.querySelectorAll(".space");
const boardState =  [
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0]
                    ]
const whosTurn = document.getElementById("turn");

const loadCoordinates = () => {
    let counter = 0;
    for(let i = 0; i < Math.sqrt(spaces.length); i++) {
        for(let j = 0; j < Math.sqrt(spaces.length); j++) {
            spaces[counter].dataset.row = i;
            spaces[counter].dataset.col = j;
            counter++;
        }
    }
}

const empty = 0;
const black = 1;
const white = 2;

let playerTurn; 

const blackHtml = `<div class="circle playerTwo"></div>`;
const whiteHtml = `<div class="circle playerOne"></div>`;

const paintBoard = () => {
    let currSpace;
    for(let i = 0; i < boardState.length; i++) {
        for(let j = 0; j < boardState.length; j++) {
            currSpace = document.querySelector("[data-col='" + j + "'][data-row='" + i + "']");
            switch(boardState[i][j]) {
                case 1:
                    currSpace.innerHTML = blackHtml;
                    break;
                case 2:
                currSpace.innerHTML = whiteHtml;
                    break;
                default:
                currSpace.innerHTML = "";
           }  
        }
    }
    return;
}

const changeTurn = (turn) => {
    whosTurn = (black) ? white : black;
    whosTurn.innerText = (turn == black) ? "Black" : "White";
    return;
}

const search = (turn, square, stepRow, stepCol) => {
    let col, row;
    if(square.target.classList[0] == "space") {
        col = parseInt(square.target.dataset.col);
        row = parseInt(square.target.dataset.row);
    } else {
        col = parseInt(square.target.parentElement.dataset.col);
        row = parseInt(square.target.parentElement.dataset.row);
    }

        let counter = 0;
        if(!boardState[row][col]) {
            // for (let i = 0; i < Math.sqrt(spaces.length); i++) {
            while (col + stepCol <)    
                if(boardState[row + stepRow][col + stepCol] !== turn && boardState[row + stepRow][col + stepCol]) {
                    console.log("continue");
                    counter++;
                    stepRow += stepRow;
                    stepCol += stepCol;
                    } //else if (boardState[row + stepRow][col + stepCol] ) {}
            }
        // }
}

const spaceClickHandler = (e) => {

    //Check to the right
    search(playerTurn, e, 0, 1);
}


const gameLoad = () => {

    boardState[3][3] = white;
    boardState[4][4] = white;

    boardState[3][4] = black;
    boardState[4][3] = black;   

    boardState[5][3] = white;

    loadCoordinates();
    
    paintBoard();
    playerTurn = black;
    whosTurn.innerText = "Black";

    spaces.forEach(space => {
        space.addEventListener("click", spaceClickHandler, false);
    })
}
gameLoad();