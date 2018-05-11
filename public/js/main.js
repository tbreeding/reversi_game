//Global Variables
const spaces = document.querySelectorAll(".space");
const whosTurn = document.getElementById("turn");
const resetBtn = document.querySelectorAll(".resetBtn");
const gameOverModal = document.getElementById("gameOverModal");
const blackFinalScore = document.getElementById("blackScore");
const whiteFinalScore = document.getElementById("whiteScore");
const winner = document.getElementById("winner");

console.log(gameOverModal.style.display)

let boardState =  [];
const empty = 0;
const black = 1;
const white = 2;

let playerTurn; 
let nextTurn = false;
let validMoves = 0;

const blackHtml = `<div class="circle playerTwo"></div>`;
const whiteHtml = `<div class="circle playerOne"></div>`;

//load the coordinates into the spaces
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

//place the appropriate circles on spaces in the UI
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

const checkEndGame = () => { 
    boardState.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if(boardState[rowIndex][colIndex] === 0) {
                if(isValidMove([rowIndex, colIndex])) {
                        search(playerTurn, [rowIndex, colIndex], 0, 1, false); //right
                        search(playerTurn, [rowIndex, colIndex], 0, -1, false); //left
                        search(playerTurn, [rowIndex, colIndex], 1, 0, false); //down
                        search(playerTurn, [rowIndex, colIndex], -1, 0, false); //up
                
                        search(playerTurn, [rowIndex, colIndex], 1, 1, false); // down, right
                        search(playerTurn, [rowIndex, colIndex], 1, -1, false); // down, left
                        search(playerTurn, [rowIndex, colIndex], -1, 1, false); // up, right
                        search(playerTurn, [rowIndex, colIndex], -1, -1, false); //up, left     
                    } 
            }
        });
    });
    console.log(validMoves);
    return validMoves > 0 ? false : true;
}

const endGame = () => {
    console.log('over')
    let blackScore = 0;
    let whiteScore = 0;
    boardState.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if(boardState[rowIndex][colIndex] == black) {
               blackScore++;
            } else if(boardState[rowIndex][colIndex] == white) {
                whiteScore++;
            }
        });
    });
    blackFinalScore.innerText = blackScore;
    whiteFinalScore.innerText = whiteScore;
    if (blackScore > whiteScore) {
        winner.innerText = "Black!";
    } else if (whiteScore > blackScore) {
        winner.innerText = "White!";
    } else {
        winner.innerText = "Tie!!"
    }
    gameOverModal.style.display = "flex";
    console.log(gameOverModal.style)
    // alert(`Black: ${blackScore} - White: ${whiteScore}`)
}

//search the surrounding spaces for possible moves
const search = (currPlayer, square, stepRow, stepCol, moveOrEndGameCheck) => {
    let col, row;
    const opponent = currPlayer === black ? white : black;
    //test to see if a blank square or an occupied square has been clicked
    //if blank, grab the coordinates. If occupied, grab the coordinates of the parents 
    row = square[0];
    col = square[1];
    // set the flag to stop the while loop
    let end = false;

    //this holds the spots to flip after the turn is complete
    let goodSpots = [];

            let curRow = row + stepRow;
            let curCol = col + stepCol;

            while(!end) {
                
                if((curRow < 0) || (curRow >= Math.sqrt(spaces.length)) || (curCol < 0) || (curCol >= Math.sqrt(spaces.length))) {
                    //if the adjacent square is the past the end of the board 
                    //**this must be first or you will get an undefined if testing for another condition
                        //end loop and return
                    end = true;
                } else if(boardState[curRow][curCol] === 0){
                    //else if the adjacent square is empty
                        //end loop and return                 
                    end = true;
                } else if(boardState[curRow][curCol] == opponent) {
                    //else if the adjacent square is the opponent
                        //push that square's coordinates to an Array (good spots)
                        //increase the steps by their step value to set the new coordinate for testing
                        //continue loop
                    goodSpots.push([curRow, curCol])
                    curRow += stepRow;
                    curCol += stepCol;
                } else {
                    //else if the adjacent square is the current player
                        //flip all coordinates of (good spots) Array to current player (even if it's zero)
                        //end turn
                    if(moveOrEndGameCheck){
                        goodSpots.forEach(val => {
                            boardState[val[0]][val[1]] = currPlayer;
                        })

                        //if move yeilded some goodSpots, flip the clicked position to current player
                        // flag for next move and repaint the board
                        if(goodSpots.length > 0) {
                            boardState[row][col] = currPlayer;
                            nextTurn = true;
                            paintBoard();
                        } 
                    } else {
                        if(goodSpots.length > 0) {
                            validMoves += goodSpots.length;
                        }
                    }
                    end = true
                }

            } 
        return;
}

//initial check if the move is valid
const isValidMove = (square) => {
    let isValid = false;
    let col, row;

    row = square[0];
    col = square[1];
    // }
    let currSpot = boardState[row][col];
    //if there is already something there, not valid.
    if(currSpot !== 0) return false;

    //check to see if each adjacent space is off the board, blank, or the opponent's piece
    if (row - 1 >= 0 && boardState[row - 1][col] && boardState[row - 1][col] != playerTurn) isValid = true //up
    if (row + 1 < Math.sqrt(spaces.length) && boardState[row + 1][col] && boardState[row + 1][col] != playerTurn) isValid = true //down
    if (col + 1 < Math.sqrt(spaces.length) && boardState[row][col + 1] && boardState[row][col + 1] != playerTurn) isValid = true //right
    if (col - 1 >= 0 && boardState[row][col - 1] && boardState[row][col - 1] != playerTurn) isValid = true //right
    if (col + 1 < Math.sqrt(spaces.length) && row - 1 >= 0 && boardState[row - 1][col + 1] && boardState[row - 1][col + 1] != playerTurn) isValid = true //up, right
    if (col - 1 >= 0 && row - 1 >= 0 && boardState[row - 1][col - 1] && boardState[row - 1][col - 1] != playerTurn) isValid = true //up, left
    if (col + 1 < Math.sqrt(spaces.length) && row + 1 < Math.sqrt(spaces.length) && boardState[row + 1][col + 1] && boardState[row + 1][col + 1] != playerTurn) isValid = true //down, right
    if (col - 1 >= 0 && row + 1 < Math.sqrt(spaces.length) && boardState[row + 1][col - 1] && boardState[row + 1][col - 1] != playerTurn) isValid = true //down, left

    return isValid;
}

const spaceClickHandler = (e) => {
    let clickedSpot = [parseInt(e.currentTarget.dataset.row), parseInt(e.currentTarget.dataset.col)];
    // debugger;
    nextTurn = false;

    if(isValidMove(clickedSpot)) {
    //Check to the right
        search(playerTurn, clickedSpot, 0, 1, true); //right
        search(playerTurn, clickedSpot, 0, -1, true); //left
        search(playerTurn, clickedSpot, 1, 0, true); //down
        search(playerTurn, clickedSpot, -1, 0, true); //up

        search(playerTurn, clickedSpot, 1, 1, true); // down, right
        search(playerTurn, clickedSpot, 1, -1, true); // down, left
        search(playerTurn, clickedSpot, -1, 1, true); // up, right
        search(playerTurn, clickedSpot, -1, -1, true); //up, left      
    }
    // debugger;
    if(nextTurn) {
        playerTurn = playerTurn == black ? white : black;
        if(!checkEndGame()) {
            validMoves = 0;
            whosTurn.innerText = (playerTurn === black) ? "Black" : "White";
        } else {
            setTimeout(() => {
                endGame();
            }, 500);
            
        }
    }
}


const gameLoad = () => {
    
    boardState =  [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]

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
    });

    resetBtn.forEach(btn => {
        btn.addEventListener("click", gameLoad, false);
    });
    
    gameOverModal.style.display = "none";

}
gameLoad();