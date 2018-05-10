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

const search = (turn, square, stepRow, stepCol, dir) => {
    console.log(dir)
    let col, row;
    if(square.target.classList[0] == "space") {
        col = parseInt(square.target.dataset.col);
        row = parseInt(square.target.dataset.row);
    } else {
        col = parseInt(square.target.parentElement.dataset.col);
        row = parseInt(square.target.parentElement.dataset.row);
    }

        let end = false;
        let goodSpots = [];
        if(boardState[row][col] === 0) {

            let curRow = row + stepRow;
            let curCol = col + stepCol;

            while(!end) {
                
                if(boardState[curRow][curCol] !== turn && !!boardState[curRow][curCol]) {

                    goodSpots.push([curRow, curCol])
                    curRow += stepRow;
                    curCol += stepCol;
                    console.log("push", goodSpots);

                } else if (curRow < 0 || 
                    curRow >= Math.sqrt(spaces.length) || 
                    curCol < 0 || 
                    curCol >= Math.sqrt(spaces.length)) {

                        playerTurn = turn == black ? white : black;
                        console.log("end of board");
                        whosTurn.innerText = (playerTurn === black) ? "Black" : "White";

                        end = true;
                } else {
                    goodSpots.forEach(val => {
                        boardState[val[0]][val[1]] = turn;
                    })
                    if(goodSpots.length > 0) {
                        boardState[row][col] = turn;

                        paintBoard();

                        playerTurn = turn == black ? white : black;
                        console.log("go");
                        whosTurn.innerText = (playerTurn === black) ? "Black" : "White";
                    } else {
                        console.log("nope")
                    }
                    
                    end = true;
                }
            } //else if (boardState[row + stepRow][col + stepCol] ) {}
        }
        // }
        return;
}

const spaceClickHandler = (e) => {
    
    //Check to the right
    search(playerTurn, e, 0, 1, "right");
    search(playerTurn, e, 0, -1, "left");
    search(playerTurn, e, 1, 0, "down");
    search(playerTurn, e, -1, 0, "up");

    search(playerTurn, e, 1, 1, "down, right");
    search(playerTurn, e, 1, -1, "down, left");
    search(playerTurn, e, -1, 1, "up, right");
    search(playerTurn, e, -1, -1, "up, left");

    console.log("@@@@@@@ END @@@@@@")
}


const gameLoad = () => {

    boardState[3][3] = white;
    boardState[4][4] = white;

    boardState[3][4] = black;
    boardState[4][3] = black;   

    // boardState[3][5] = white; 
    // boardState[3][6] = white; 
    // boardState[3][7] = black; 
    loadCoordinates();
    
    paintBoard();
    playerTurn = black;
    whosTurn.innerText = "Black";

    spaces.forEach(space => {
        space.addEventListener("click", spaceClickHandler, false);
    })
}
gameLoad();