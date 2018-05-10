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
let nextTurn = false;

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

const search = (currPlayer, square, stepRow, stepCol, dir) => {
   
    // console.log(dir)
    
    let col, row;
    const opponent = currPlayer === black ? white : black;
    //test to see if a blank square or an occupied square has been clicked
    //if blank, grab the coordinates. If occupied, grab the coordinates of the parents 
    if(square.target.classList[0] == "space") {
        col = parseInt(square.target.dataset.col);
        row = parseInt(square.target.dataset.row);
    } else {
        col = parseInt(square.target.parentElement.dataset.col);
        row = parseInt(square.target.parentElement.dataset.row);
    }
    // set the flag to stop the while loop
    let end = false;

    //this holds the spots to flip after the turn is complete
    let goodSpots = [];

            let curRow = row + stepRow;
            let curCol = col + stepCol;

            while(!end) {
                
                //else if the adjacent square is the past the end of the board 
                //**this must be first or you will get an undefined if testing for another condition
                    //end loop and return
                //if the adjacent square is the opponent
                    //push that square's coordinates to an Array (good spots)
                    //increase the steps by their step value to set the new coordinate for testing
                    //continue loop
                //else if the adjacent square is empty
                    //end loop and return
                //else if the adjacent square is the past the end of the board
                    //end loop and return
                //else if the adjacent square is the current player
                    //flip all coordinates of (good spots) Array to current player
                    //end turn

                    // let compareSpotVal = boardState[curRow][curCol];
                    // let curIsOpp = compareSpotVal == opponent;
                if((curRow < 0) || (curRow >= Math.sqrt(spaces.length)) || (curCol < 0) || (curCol >= Math.sqrt(spaces.length))) {
                    return;
                    end = true;

                } else if(boardState[curRow][curCol] === 0){                    
                    return;
                    end = true;
                } else if(boardState[curRow][curCol] == opponent) {
                    
                    goodSpots.push([curRow, curCol])
                    curRow += stepRow;
                    curCol += stepCol;
                    // console.log("push", goodSpots);
                } else {
                    goodSpots.forEach(val => {
                        boardState[val[0]][val[1]] = currPlayer;
                    })
                    if(goodSpots.length > 0) {
                        boardState[row][col] = currPlayer;
                        nextTurn = true;
                        paintBoard();

                    } 
                    return;
                    end = true;
                }
            } 
        return;
}

const isValidMove = (square) => {
    let isValid = false
    

    if(square.target.classList[0] == "space") {
        col = parseInt(square.target.dataset.col);
        row = parseInt(square.target.dataset.row);
    } else {
        col = parseInt(square.target.parentElement.dataset.col);
        row = parseInt(square.target.parentElement.dataset.row);
    }
    
    let currSpot = boardState[row][col];
    if(currSpot !== 0) return false;

    if (row - 1 >= 0 && boardState[row - 1][col] && boardState[row - 1][col] != playerTurn) isValid = true //up
    if (row + 1 < Math.sqrt(spaces.length) && boardState[row + 1][col] && boardState[row + 1][col] != playerTurn) isValid = true //down
    if (col + 1 < Math.sqrt(spaces.length) && boardState[row][col + 1] && boardState[row][col + 1] != playerTurn) isValid = true //right
    if (col - 1 >= 0 && boardState[row][col - 1] && boardState[row][col - 1] != playerTurn) isValid = true //right
    if (col + 1 < Math.sqrt(spaces.length) && row - 1 >= 0 && boardState[row - 1][col + 1] && boardState[row - 1][col + 1] != playerTurn) isValid = true //up, right
    if (col - 1 >= 0 && row - 1 >= 0 && boardState[row - 1][col - 1] && boardState[row - 1][col - 1] != playerTurn) isValid = true //up, left
    if (col + 1 < Math.sqrt(spaces.length) && row + 1 < Math.sqrt(spaces.length) && boardState[row + 1][col + 1] && boardState[row + 1][col + 1] != playerTurn) isValid = true //down, right
    if (col - 1 >= 0 && row + 1 < Math.sqrt(spaces.length) && boardState[row + 1][col - 1] && boardState[row + 1][col - 1] != playerTurn) isValid = true //down, left

    console.log(isValid)
    return isValid;

}

const spaceClickHandler = (e) => {
    nextTurn = false;
    // debugger;
    if(isValidMove(e)) {
    //Check to the right
        search(playerTurn, e, 0, 1, "right");
        search(playerTurn, e, 0, -1, "left");
        search(playerTurn, e, 1, 0, "down");
        search(playerTurn, e, -1, 0, "up");

        search(playerTurn, e, 1, 1, "down, right");
        search(playerTurn, e, 1, -1, "down, left");
        search(playerTurn, e, -1, 1, "up, right");
        search(playerTurn, e, -1, -1, "up, left");        
    }
    if(nextTurn) {
        playerTurn = playerTurn == black ? white : black;
        whosTurn.innerText = (playerTurn === black) ? "Black" : "White";
    }
}


const gameLoad = () => {

    boardState[3][3] = white;
    boardState[4][4] = white;

    boardState[3][4] = black;
    boardState[4][3] = black;   

    loadCoordinates();
    paintBoard();
    playerTurn = black;
    whosTurn.innerText = "Black";

    spaces.forEach(space => {
        space.addEventListener("click", spaceClickHandler, false);
    })
}
gameLoad();