////////////////////
//Sudoku variables//
////////////////////

//Max board size
let MBS = 9;
let EMPTY = 0;

var iterations = 0;

//A 3d array that keeps track of what viable number placement options there are for each position on the board
var viableNumberChecks = [];

//Initialise board
var board  = 
[
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0]
];

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
    [0, 0, 0,  0, 0, 0,  0, 0, 0]
];

var defaultBoard = 
[
    [8, 0, 0,  4, 0, 6,  0, 0, 7],
    [0, 0, 0,  0, 0, 0,  4, 0, 0],
    [0, 1, 0,  0, 0, 0,  6, 5, 0],
    
    [5, 0, 9,  0, 3, 0,  7, 8, 0],
    [0, 0, 0,  0, 7, 0,  0, 0, 0],
    [0, 4, 8,  0, 2, 0,  1, 0, 3],
    
    [0, 5, 2,  0, 0, 0,  0, 9, 0],
    [0, 0, 1,  0, 0, 0,  0, 0, 0],
    [3, 0, 0,  9, 0, 2,  0, 0, 5],
];

///////////////////
//Sudoku Function//
///////////////////

function FindEmpty(_board)
{
    var returnVals = [];
    for (var i = 0; i < MBS; i++)
    {
        for (var j = 0; j < MBS; j++)
        {
            if(_board[i][j] == EMPTY)
            {
                returnVals = [true, i, j];
                return returnVals;
            }
        }
    }
    returnVals = [false];
    return returnVals;
}


//Checks if the _x row is clear of the _numToCheck
function RowClear(_board, _x, _numToCheck)
{
    for (var i = 0; i < MBS; i++)
    {
        if(_board[_x][i] == _numToCheck)
        {
            return false;
        }
    }
    return true;
}

//Checks if the _y column is clear of the _numToCheck
function ColumnClear(_board, _y, _numToCheck)
{
    for (var i = 0; i < MBS; i++)
    {
        if(_board[i][_y] == _numToCheck)
        {
            return false;
        }
    }
    return true;
}

//Checks if the 3x3 box is clear of _numToCheck
function BoxClear(_board, _x, _y, _numToCheck)
{
    let xBoxStart = _x - (_x % 3);
    let yBoxStart = _y - (_y % 3);
    
    for (var i = 0; i < 3; i++)
    {
        for (var j = 0; j < 3; j++)
        {
            if(_board[i + xBoxStart][j + yBoxStart] == _numToCheck){ return false; }
        }
    }
    return true;
}

function CanPlace(_board, _x, _y, _numToCheck)
{
    return _board[_x][_y] == EMPTY
        && RowClear(_board, _x, _numToCheck)
        && ColumnClear(_board, _y, _numToCheck)
        && BoxClear(_board, _x, _y, _numToCheck);
}

//Finds all the numbers that are possibly viable to place in a tile
function FindViableChecks(_board)
{
    //Reset the 3D array
    viableNumberChecks = viableNumberChecks.splice(0, viableNumberChecks.length);
    viableNumberChecks = CreateArray(MBS, MBS, 0);
    console.log(viableNumberChecks);

    for (var x = 0; x < MBS; x++)
    {
        for (var y = 0; y < MBS; y++)
        {
            //Check if we can even place something
            if(_board[x][y] == EMPTY)
            {
                for (var num = 1; num <= MBS; num++)
                {
                    if(CanPlace(_board, x, y, num))
                    {
                        viableNumberChecks[x][y].push(num);
                    }
                }
            }
        }
    }

    //Shuffle the sequence of random numbers so that it has a better chance of quickly beating backtracking-counter-boards (the difficult board below was specifically designed to make it take long for backtracking to complete, shuffling the board this way makes it so a board can't be designed to make it take as long as possible, although this does mean the algorithmn will result in different solve times, even on the same board)
    // for (var x = 0; x < MBS; x++)
    // {
    //     for (var y = 0; y < MBS; y++)
    //     {
    //         //If there is only 1 viable number for a position, then place that number
    //         if(viableNumberChecks[x][y].count == 1)
    //         {
    //             _board[x][y] = viableNumberChecks[x][y][0];
    //             viableNumberChecks[x][y].removeAll();
    //         }
    //         else
    //         {
    //             //Otherwise shuffle the sequence
    //             viableNumberChecks[x][y].shuffle();
    //         }
    //     }
    // }
    return viableNumberChecks;
}

//Sudoku recursive brute force back-tracking function
function BruteForceSudoku(_board)
{
    var foundEmptySlot = FindEmpty(_board);
    //Find the next empty position on the board
    if(!foundEmptySlot[0])
    {
        return true;
    }

    var x = foundEmptySlot[1];
    var y = foundEmptySlot[2];
    
    //Only check the numbers that aren't already in this row, column or box
    for(var i = 0; i < viableNumberChecks[x][y].length; i++)
    {
        iterations += 1;

        //Print a counter every 100,000 iterations
        if(iterations % 1000 == 0)
        {
            console.log("Current interations:", iterations);
        }

        //Recheck if this number can actually be placed, 
        //because we may have updated the board by the time we get here
        if(CanPlace(_board, x, y, viableNumberChecks[x][y][i]))
        {
            //Try out this number
            _board[x][y] = i;
            
            //Do it again
            if(BruteForceSudoku(_board))
            {
                //Returns true if we hit the base case of there being no more open places
                return true;
            }
            
            //Failed to solve using the current number, so set it back to 0
            _board[x][y] = EMPTY;
        }
    }
    //Backtrack to the previous function call
    return false;
}

//Generate random Sudoku board based on difficulty setting
function GenerateRandomBoard()
{
    //Determine difficulty here









    /////////////////////////////////
    //Create and solve a board here//
    /////////////////////////////////
    console.log("Generating random Sudoku puzzle...");
    var randomSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    //Shuffle the sequence to make it random
    arrayShuffle(randomSequence);
    
    //Set the first row of the board to this random sequence
    Slice2DArray(emptyBoard, board);
    board[0] = randomSequence.slice();
    console.log(board);

    //Calculate the checks so we only check what can actually be placed
    FindViableChecks(board);

    //Solve the board
    if(!BruteForceSudoku(board))
    {
        //Can't solve the board???? this should be impossible!!!!
        console.log("Failed to solve the always solvable sudoku puzzle! You have a bug!");
    }
    
    // //Find a random position and set it to 0
    // //Do this x amount of times based on difficulty
    // for _ in 1...clearNumber
    // {
    //     let index1:Int = Int.random(in: 0..<MBS);
    //     let index2:Int = Int.random(in: 0..<MBS);
    //     board[index1][index2] = 0;
    // }
    // print("Finished generating random Sudoku puzzle!");
}


////////////////////////////////////
//HTML, CSS, JAVASCRIPT, DOM stuff//
////////////////////////////////////

//Web interface variables
var selectedNum;
var selectedTile;
var disableSelect;
var selectedBoardTilePos = 0;

var difficulty = 0;

window.onload = function()
{
    //Run the game when the start game button is pressed
    id("start-btn").addEventListener("click", StartGame);

    qs("body").classList.add("darkmode");

    //Add an event listen to each number in the number container on the right
    for (let i = 0; i < id("num-container").children.length; i++) 
    {
        const num = id("num-container").children[i].addEventListener("click", function()
        {
            //If selected is not disabled
            if(!disableSelect)
            {
                //If the number is already selected, un-select it
                if(this.classList.contains("selected"))
                {
                    //Remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                }
                else
                {
                    //Deselect the other numbers
                    for (let i = 0; i < MBS; i++) 
                    {
                        id("num-container").children[i].classList.remove("selected");
                    }  
                    
                    //Select it and update selectNum
                    this.classList.add("selected");
                    selectedNum = this;
                    UpdateMove();
                }
            }
        });
    }
}

function StartGame()
{
    //Choose the difficulty for the game
    if(id("difficulty-1").checked)
    {
        //Slice2DArray(defaultBoard, board);
        GenerateRandomBoard(board);
    } 

    //Allows the player to select things
    disableSelect = false;

    //Draw the board
    createGameBoard(board);

    //Show the number container
    id("num-container").classList.remove("hidden"); 
}

function createGameBoard(board)
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

            if(board[i][j] != 0)
            {
                tile.textContent = board[i][j].toString();
            }
            else
            {
                //Add click event listener to tile
                tile.addEventListener("click", function()
                {
                    //If selecting is enabled
                    if(!disableSelect)
                    {
                        //If the tile is already selected
                        if(tile.classList.contains("selected"))
                        {
                            tile.classList.remove("selected");
                            selectedTile = null;
                        }
                        else
                        {
                            //Deselect the other tile
                            var boardTiles = qsa(".tile");

                            boardTiles[selectedBoardTilePos].classList.remove("selected");
                            foundSelected = true;

                            //Add selection and update variable
                            tile.classList.add("selected");
                            selectedTile = tile;
                            selectedBoardTilePos = i * MBS + j;
                            UpdateMove();
                        }
                    }
                });
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
                tile.classList.add("rightborder");
            }

            //Add the tile to the board
            id("board").appendChild(tile);
        }
    }
}

//Function that runs when you click a tile while selecting a number
function UpdateMove()
{
    if(selectedTile && selectedNum)
    {
        selectedTile.textContent = selectedNum.textContent;

        //Divide the 1D array pos back to a 2D array pos
        var row = Math.floor(selectedBoardTilePos / 9);
        var column = selectedBoardTilePos % 9;

        //The the board position
        board[row][column] = parseInt(selectedNum.textContent, 10);
    }

    console.log(FindViableChecks(board));
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


//Utility functions

//Function that creates multi dimentional arrays
//Can be used like var arr = CreateArray(9, 9, 1);
//Creates a 9x9 3D array with 1 element in the third dimension
function CreateArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = CreateArray.apply(this, args);
    }

    return arr;
}

//Creates a non-refernce copy of a 2D array, copies originalArr into copyArr
function Slice2DArray(originalArr, copyArr)
{
    //Clear the existing array
    copyArr.splice(0, copyArr.length);

    //Add the contents of originalArr to copyArr by copy and not reference
    for(var i = 0; i < originalArr.length; i++)
    {
        copyArr.push(originalArr[i].slice());
    }
}

//Fisher-Yates shuffle of an array
function arrayShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
  }