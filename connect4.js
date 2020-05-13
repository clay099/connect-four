/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let htmlBoard = document.getElementById("board"); // get "htmlBoard" variable from the item in HTML w/ID of "board"
const playerOne = document.getElementById("player1");
const playerTwo = document.getElementById("player2");
const newGameBtn = document.getElementById("new-game"); //get new-game element
const WIDTH = 7;
const HEIGHT = 6;

let board; // array of rows, each row is array of cells  (board[y][x])
let currPlayer = 1; // active player: 1 or 2

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
    for (let y = 0; y < HEIGHT; y++) {
        board.push(Array.from({ length: WIDTH }));
    }
}

function newGame() {
    board = [];

    makeBoard();
    makeHtmlBoard();

    const headerPlayer = document.getElementById("column-top");

    headerPlayer.addEventListener("click", handleClick);

    // add new class to top row which will change to be the current player class
    headerPlayer.classList.add(currPlayer === 1 ? "column-top-p1" : "column-top-p2");
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    // create the top row for the row to be selected and peices to be dropped down
    let top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    // loop to create cells with dynamic x value
    for (let x = 0; x < WIDTH; x++) {
        let headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    // add headCell to the board
    htmlBoard.append(top);

    // creates the playing board for peices to fill up from top to bottom
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            row.append(cell);
        }
        htmlBoard.append(row);
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
    for (let y = HEIGHT - 1; y >= 0; y--) {
        // check the board array at position y and x. If undefined return the value of y
        if (!board[y][x]) {
            return y;
        }
    }
    return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
    let piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${currPlayer}`);

    let location = document.getElementById(`${y}-${x}`);
    location.append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
    let headerPlayer = document.getElementById("column-top");
    headerPlayer.removeEventListener("click", handleClick);
    window.setTimeout(() => {
        alert(msg);
    }, 500);
    board.length = 0;
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
    // get x from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place currPlayer number in board array and add to HTML table
    board[y][x] = currPlayer;
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // as the handleClick event is within the makeHtmlBoard funciton we have access to row and cell.
    // check that the board has every row and that every row has a cell
    if (board.every((row) => row.every((cell) => cell))) return endGame(`The game is a tie`);

    // switch players
    currPlayer = currPlayer === 1 ? 2 : 1;
    let headerPlayer = document.getElementById("column-top");
    headerPlayer.classList.toggle("column-top-p1");
    headerPlayer.classList.toggle("column-top-p2");

    //logic for turn tracker
    playerOne.style.opacity = currPlayer === 1 ? 1 : 0.3;
    playerTwo.style.opacity = currPlayer === 2 ? 1 : 0.3;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
    function _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(
            ([y, x]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
        );
    }

    // loop through and provide variables for horiz, ver, diagDr & diagDL to be checked against _win function
    // each variable will provide 4 x & 4 y corodinates to check
    // note -- as each loop starts at y & x andcontinues until the y or x values are the maximum some outputs will exceed the cell board width or height. the _win function will deal with this logic
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let horiz = [
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3],
            ];
            let vert = [
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x],
            ];
            let diagDR = [
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3],
            ];
            let diagDL = [
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3],
            ];

            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

// create new game logic
newGameBtn.addEventListener("click", function (e) {
    board.length = 0;
    htmlBoard.innerHTML = "";
    currPlayer = 1;
    playerTwo.style.opacity = 0.3;
    playerOne.style.opacity = 1;
    newGame();
});

newGame();
