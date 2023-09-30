var board;
var score = 0;
var rows = 4;
var columns = 4;
var maxScore = 0;

window.onload = function () {
    // Calls the function to create the board and tiles
    setGame();
}

function setGame() {

    // This is the board initially it is all zeroes but will get updated along the way.
    board = [

        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]

        // [2, 512, 128, 64],
        // [8, 64, 1024, 8],
        // [32, 1024, 2, 128],
        // [512, 128, 2, 16]

    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            // above two lines create <div id="r-c"></div>
            let num = board[r][c];
            // the value of the number on the board.

            updateTile(tile, num);
            // the update tile function will take num and add the correspoding class to the tile, for ex: if num=4, then x4 class will be added to the tile which will ultimately style the tile appropriately.

            document.getElementById("board").append(tile);
            // Finally we will add the tile to the board.
        }
    }

    // To add tiles to begin the game
    addTwo();
    addTwo();

    // This is to remove the reset button untill the game is over
    const b = document.querySelector("button");
    b.classList.add("fadeOut");

}

// the resetgame function will simply remove all the tiles from the board and then add new tiles again by calling the set game function.
function resetGame() {

    // To upadate the game over message to goodluck
    let m = document.getElementById("heading");
    m.innerText = "Goodluck !!";

    // To change the score to zero
    let s = document.getElementById("score");
    s.innerText = score;

    // to remove all the tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let k = document.getElementById(r.toString() + "-" + c.toString());
            k.remove();
        }
    }

    // to add new tiles
    setGame();
}

// the has empty tile will check if there is an empty tile on the board (with value 0)
function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

// the isgameover function will determine if the game is over or not.
// since this function is called after the hasemptytiles function, we know that there are no empty tiles on the board.
// now we just have to check if any adjacent tiles have the same value.
function isGameOver() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let h = board[i][j];

            // the first if statment is for all the tiles except the last row and the last column (we cannot check the whole board at once, since for the last row and column, the value of i+1 or j+1 will exceed the length of the board.)
            if (i < 3 && j < 3) {

                // this statment will check if the tile to the immediate right or to the immediate bottom is equal to the current tile. if yes, then the game is not over and we will return to the game.
                // note that we dont have to check the tile to the left or above, since those tiles have already been passed through the for loop.
                if (h == board[i + 1][j] || h == board[i][j + 1]) {
                    return;
                }
            }

            // this statement is for the last column i.e j=3 .
            else if (i < 3) {

                // here we only have to check the tile directly below the current tile, since we are only checking a single column
                if (h == board[i + 1][j]) {
                    return
                }
            }
            // this statement is for the last row i.e j=3 .
            else if (j < 3) {
                // here we only have to check the tile directly right of the current tile, since we are only checking a single row
                if (h == board[i][j + 1]) {
                    return;
                }
            }
        }
    }

    // if the for loop is executed fully and we dont return to the game, that means the game is over
    // hence we will print a game over message and update the max score.
    let m = document.getElementById("heading");
    m.innerText = "GameOver , press reset to try again";
    let s = document.getElementById("message");
    if (score > maxScore) {
        maxScore = score;
    }
    s.innerText = "Your best score is " + maxScore;
    const b = document.querySelector("button");
    b.classList.remove("fadeOut");
    b.classList.add("fadeIn");
    // the above statements will add the reset button

    // we call the resetgame function through the reset button
    b.addEventListener("click", () => {
        score = 0;
        resetGame();
    });
    return;
}

// the function addtwo will add a tile with value two after each move.
function addTwo() {

    // we will first check if there are empty spaces and the game is not over. if no, then we will return to the game.
    if (!hasEmptyTile()) {
        isGameOver();
        return;
    }

    // the below for loop will iterate randomly through different tiles on the board and see if they are empty or not
    // the first empty tile found will be updated to a 2, and we exit the function.
    let found = false;
    while (!found) {

        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

// update tile will remove the previous value of the tile and add the updated value.
function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        }
        else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        addTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        addTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        addTwo();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        addTwo();
    }
})

// this will remove all the zeroes from a row.
function filterZero(row) {
    return row.filter(num => num != 0)
}

// the slide function will first remove all the zeroes, then add any two adjacent equal values, then add the zeroes again, behind the changed values.
function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];

            //update score.
            let s = document.getElementById("score");
            s.innerText = score;
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    // isGameOver();
    return row;
}

// slideleft simply takes the row after sliding and updates the rows according to the board.
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// slideright function works similar to the slideleft function but it reverses the rows befores sliding and after sliding. 
function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row;


        row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// The slideup function takes a column and converts it into row which can utlize the slide function, and then changes the updated row into a column again.
function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c]=row[0];
        // board[1][c]=row[1];
        // board[2][c]=row[2];
        // board[3][c]=row[3];

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// same aas slide up but reverses the said row before and after sliding.
function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c]=row[0];
        // board[1][c]=row[1];
        // board[2][c]=row[2];
        // board[3][c]=row[3];

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}




