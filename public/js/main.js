const spaces = document.querySelectorAll(".space");
const plays = new Array(64).fill(0);

const white = 2;
const black = 1;

console.log(spaces);
const blackHtml = `<div class="circle playerTwo"></div>`;
const whiteHtml = `<div class="circle playerOne"></div>`;

const paintBoard = () => {
    spaces.forEach((space, index) => {
       switch(plays[index]) {
            case 1:
                space.innerHTML = blackHtml;
                break;
            case 2:
                space.innerHTML = whiteHtml;
                break;
            default:
                space.innerHTML = "";
       }
    });

}
const gameLoad = () => {
    plays[27] = white;
    plays[36] = white;

    plays[28] = black;
    plays[35] = black;   
    
    paintBoard();
}

gameLoad();