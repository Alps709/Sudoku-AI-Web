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

window.onload = function()
{
    //Run the game when the start game button is pressed
    id("start-btn").addEventListener("click", StartGame);
}

function StartGame()
{
    console.log(viableNumberChecks);
}

function id(id)
{
    return document.getElementById(id);
}