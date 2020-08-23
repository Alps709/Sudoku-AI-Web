//Generate sudoku boards
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

//Function that creates multi dimentional arrays
function CreateArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = CreateArray.apply(this, args);
    }

    return arr;
}

//Max board size
let MBS = 9;
let EMPTY = 0;

//A 3d array that keeps track of what viable number placement options there are for each position on the board
var viableNumberChecks = CreateArray(MBS, MBS, 0);

var emptyBoard = 
[
        [0, 0, 0,  0, 0, 0,  0, 0, 0],
        [0, 0, 0,  0, 0, 0,  0, 0, 0],
        [0, 0, 0,  0, 0, 0,  0, 0, 0],
        
        [0, 0, 0,  0, 0, 0,  0, 0, 0],
        [0, 0, 0,  0, 0, 0,  0, 0, 0],
        [0, 0, 0,  0, 0, 0,  0, 0, 0],
        
        [0, 0, 0,  0, 0, 0,  0, 0, 0],
        [0, 0, 0,  0, 0, 0,  0, 0, 0],
        [0, 0, 0,  0, 0, 0,  0, 0, 0],
];

var selectedNum;
var selectedTile;
var disableSelect;

var board;

window.onload = function()
{
    //Run the game when the start game button is pressed
    id("start-btn").addEventListener("click", StartGame);
}

function UpdateTheme()
{
    if(id("theme-1").checked)
    {
        qs("body").classList.remove("darkmode");
    }
    else
    {
        qs("body").classList.add("darkmode");
    }
}

function StartGame()
{
    //Choose the difficulty for the game
    if(id("difficulty-1").checked)
    {
        board = emptyBoard;
    } 

    //Allows the player to select things
    disableSelect = false;

    //Draw the board
    drawBoard(board);

    //Show the number container
    id("num-container").classList.remove("hidden"); 
}

function drawBoard(board)
{
    ClearPreviousGame();

    //Counts the number of tiles so we can set their id's
    let idCount = 0;

    //Create the 91 board tiles
    for (let i = 0; i < MBS; i++)
    {
        for (let j = 0; j < MBS; j++)
        {
            //Create a paragraph element
            let tile = document.createElement("p");

             //Assing an id for the tile
             tile.id = idCount;
             idCount++;

            if(board[i][j] == 0)
            {
                tile.textContent = board[i][j].toString();
            }
            else
            {
                //Add click event listener to tile
            }

            //Add new tile class to all tiles
            tile.classList.add("tile");

            //Add the borders to seperate the 3x3 grids within the board
            if(i == 2 || i == 5)
            {
                tile.classList.add("bottomBorder");
            }

            if(j == 2 || j == 5)
            {
                tile.classList.add("rightBorder");
            }

            //Add the tile to the board
            id("board").appendChild(tile);
        }
    }
}

function ClearPreviousGame()
{
    let tiles = qsa(".tile");

    //Remove the tiles
    for (let i = 0; i< tiles.length; i++)
    {
        tiles[i].remove();
    }

    //Clear selected stuff
    for(let i = 0; i < id("num-container").children.length; i++)
    {
        id("num-container").children[i].classList.remove("selected");
    }

    selectedNum = null;
    selectedTile = null;
}

function qs(selector)
{
    return document.querySelector(selector);
}

function qsa(selector)
{
    return document.querySelectorAll(selector);
}

function id(id)
{
    return document.getElementById(id);
}