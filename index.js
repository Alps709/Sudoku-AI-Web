////////////////////
//Sudoku letiables//
////////////////////

//Max board size
let MBS = 9;
let EMPTY = 0;

let iterations = 0;

let solvedNum = 0;

//A 3d array that keeps track of what viable number placement options there are for each position on the board
let viableNumberChecks = [];
let viableNumberChecksSorted = [];

let startingBoard = [[]];
let solvedBoard = [[]];
//Initialise board
let board  = 
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

let emptyBoard = 
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

let defaultBoard = 
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
    for (let i = 0; i < MBS; i++)
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
    for (let i = 0; i < MBS; i++)
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
    
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
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

function VerifyBoard(_board)
{
    for (let x = 0; x < MBS; x++)
    {
        for (let y = 0; y < MBS; y++)
        {
            //Take out number and save it, plcae it back afterwards
            let tempNum = _board[x][y];
            _board[x][y] = 0;

            if(!CanPlace(_board, x, y, _board[x][y]))
            {
                _board[x][y] = tempNum;
                return false;
            }
            _board[x][y] = tempNum;
        }
    }
    return true;
}

//Finds all the numbers that are possibly viable to place in a tile
function FindViableChecks(_board)
{
    //Reset the 3D array
    viableNumberChecks = viableNumberChecks.splice(0, viableNumberChecks.length);
    viableNumberChecks = CreateArray(MBS, MBS, 0);

    for (let x = 0; x < MBS; x++)
    {
        for (let y = 0; y < MBS; y++)
        {
            //Check if we can even place something
            if(_board[x][y] == EMPTY)
            {
                for (let num = 1; num <= MBS; num++)
                {
                    if(CanPlace(_board, x, y, num))
                    {
                        viableNumberChecks[x][y].push(num);
                    }
                }
            }
            //This was going to be used as an optimization by using best first search
            //But the performance was good enough anyway
            // let PositionNum = 
            // {
            //     pos: [x, y],
            //     arrayLength: viableNumberChecks[x][y].length
            // }

            // viableNumberChecksSorted.push(PositionNum);
        }
    }
    //This was going to be used as an optimization by using best first search
    //But the performance was good enough anyway
    // viableNumberChecksSorted.sort(function(a, b)
    // {
    //     return a.arrayLength - b.arrayLength;
    // });

    // console.log(viableNumberChecksSorted);
    return viableNumberChecks;
}

//Sudoku recursive brute force back-tracking function
function BruteForceSudoku(_board)
{
    iterations++;

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
        //Recheck if this number can actually be placed, 
        //because we may have updated the board by the time we get here
        if(CanPlace(_board, x, y, viableNumberChecks[x][y][i]))
        {
            //Try out this number
            _board[x][y] = viableNumberChecks[x][y][i];
            solvedNum++
            
            //Do it again
            if(BruteForceSudoku(_board))
            {
                //Returns true if we hit the base case of there being no more open places
                return true;
            }
            
            //Failed to solve using the current number, so set it back to 0
            _board[x][y] = EMPTY;
            solvedNum--;
        }
    }
    //Backtrack to the previous function call
    return false;
}

//Generate random Sudoku board based on difficulty setting
function GenerateRandomBoard()
{
    /////////////////////////////////
    //Create and solve a board here//
    /////////////////////////////////
    console.log("Generating random Sudoku puzzle...");
    let randomSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    //Shuffle the sequence to make it random
    arrayShuffle(randomSequence);
    
    //Clear the board
    Slice2DArray(emptyBoard, board);

    //Set the top row to the new random sequence that was just generated
    board[0] = randomSequence.slice();
    solvedNum = 9;

    //Calculate the checks so we only check what can actually be placed
    FindViableChecks(board);

    //Solve the board
    //Start from the 1, 0 place since we randomly generated the first row
    iterations = 0;
    if(!BruteForceSudoku(board))
    {
        //Can't solve the board???? this should be impossible!!!!
        console.log("Failed to solve the always solvable sudoku puzzle! You have a bug!");
    }
    
    console.log("Generated a solved Sudoku board in: ", iterations, " iterations");

    //Determine difficulty here

     //Find a random position and set it to 0
     //Do this x amount of times based on difficulty
     let clearNumber = 20 + 20 * difficulty;
     for (let i = 0; i < clearNumber; i++)
     {
         let index1 = Math.floor(Math.random() * 9);
         let index2 = Math.floor(Math.random() * 9);
         board[index1][index2] = 0;
    }

    //Save the original board to use later on
    Slice2DArray(board, startingBoard);

    console.log("Finished generating random Sudoku puzzle!");
}


////////////////////////////////////
//HTML, CSS, JAVASCRIPT, DOM stuff//
////////////////////////////////////

//Web interface letiables
let selectedNum;
let selectedTile;
let disableSelect;
let selectedBoardTilePos = 0;

let difficulty = 0;
let hintNum = 3;

window.onload = function()
{
    //Run the game when the start game button is pressed
    id("start-btn").addEventListener("click", StartGame);

    //Solve the game and highlight if the player succeded or not
    id("hint-btn").addEventListener("click", GiveHint);

    //Solve the game and highlight if the player succeded or not
    id("check-solved-btn").addEventListener("click", CheckSolvedGame);

    //Solve the game and highlight if the player succeded or not
    id("solve-btn").addEventListener("click", SolveGame);

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

                    //Deselect the other tile
                    let boardTiles = qsa(".tile");

                    //Deselect the board tile when switching num-containers
                    boardTiles[selectedBoardTilePos].classList.remove("selected");
                    foundSelected = false;
                    selectedTile = null;
                    
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
        difficulty = 0;
        hintNum = 3;
        id("hint-btn").textContent = ("Give Hint: " + hintNum);
    } 
    else if(id("difficulty-2").checked)
    {
        difficulty = 1;
        hintNum = 4;
        id("hint-btn").textContent = ("Give Hint: " + hintNum);
    } 
    else
    {
        difficulty = 2;
        hintNum = 5;
        id("hint-btn").textContent = ("Give Hint: " + hintNum);
    }

    GenerateRandomBoard();

    //Allows the player to select things
    disableSelect = false;

    //Draw the board
    CreateGameBoard(board);

    //Show the number container
    id("num-container").classList.remove("hidden"); 
    id("solve-btn-div").classList.remove("hidden"); 
    id("check-solved-btn-div").classList.remove("hidden"); 
    id("hint-btn-div").classList.remove("hidden"); 
}

function GiveHint()
{
    if(hintNum > 0)
    {
        //Find the solved board

        //Copy the board into a new array to be solved
        Slice2DArray(board, solvedBoard);

        FindViableChecks(solvedBoard);

        //If it couldn't solve the player's board, 
        //or it couldn't verify the new board after solving it (there is a rare case where it can correctly solve an incorrect board, but this is caused by player error (the solving algorithmn works))
        //solve it again from the starting board
        if(!BruteForceSudoku(solvedBoard) || !VerifyBoard(solvedBoard))
        {
            //Copy the starting board onto the board to solve
            Slice2DArray(startingBoard, solvedBoard);

            FindViableChecks(solvedBoard);

            if(!BruteForceSudoku(solvedBoard))
            {
                console.log("BUG: It failed to solve the board from the correct starting board, this should be impossible!");
            }
        }

        let boardHintPlaces = [];

        for (let x = 0; x < MBS * MBS; x++)
        {
            //Divide the 1D array pos back to a 2D array pos
            let row = Math.floor(x / 9);
            let column = x % 9;

            if(board[row][column] == 0)
            {
                boardHintPlaces.push(x);
            }
        }

        if(boardHintPlaces.length > 0)
        {
            arrayShuffle(boardHintPlaces);

            //Deselect the other tile
            let boardTiles = qsa(".tile");
            
            //Divide the 1D array pos back to a 2D array pos
            let row = Math.floor(boardHintPlaces[0] / 9);
            let column = boardHintPlaces[0] % 9;
            let tile = boardTiles[row * MBS + column];
            
            board[row][column] = solvedBoard[row][column];
            tile.textContent = solvedBoard[row][column];
            tile.classList.remove("incorrect");
            tile.classList.remove("selected");
            tile.classList.add("hint");

            hintNum--;
            id("hint-btn").textContent = ("Give Hint: " + hintNum);
        }
    }
}

function CheckSolvedGame()
{
    //Copy the board into a new array to be solved
    Slice2DArray(board, solvedBoard);

    FindViableChecks(solvedBoard);

    //If it couldn't solve the player's board, 
    //or it couldn't verify the new board after solving it (there is a rare case where it can correctly solve an incorrect board, but this is caused by player error (the solving algorithmn works))
    //solve it again from the starting board
    if(!BruteForceSudoku(solvedBoard) || !VerifyBoard(solvedBoard))
    {
        //Copy the starting board onto the board to solve
        Slice2DArray(startingBoard, solvedBoard);

        FindViableChecks(solvedBoard);

        if(!BruteForceSudoku(solvedBoard))
        {
            console.log("BUG: It failed to solve the board from the correct starting board, this should be impossible!");
        }
    }

    //Deselect the other tile
    let boardTiles = qsa(".tile");

    //Deselect the board tile when switching num-containers
    boardTiles[selectedBoardTilePos].classList.remove("selected");
    foundSelected = false;
    selectedTile = null;

    //Iterate over board
    for (let x = 0; x < MBS; x++)
    {
        for (let y = 0; y < MBS; y++)
        {
            if(startingBoard[x][y] == 0)
            {
                if (board[x][y] === solvedBoard[x][y])
                {
                    //The tiles are the same number so the player correctly solved this number
                    let solvedTile = boardTiles[x * MBS + y];
                    solvedTile.classList.remove("selected");
                    solvedTile.classList.add("correct");
                }
                else
                {
                    //The tiles are not the  same number so the player didn't solve this number
                    let solvedTile = boardTiles[x * MBS + y];
                    solvedTile.classList.remove("selected");
                    solvedTile.classList.remove("correct");
                    solvedTile.classList.add("incorrect");
                }
            }
        }
    }
}

function SolveGame()
{
    //Copy the board into a new array to be solved
    Slice2DArray(board, solvedBoard);

    FindViableChecks(solvedBoard);

    //If it couldn't solve the player's board, 
    //or it couldn't verify the new board after solving it (there is a rare case where it can correctly solve an incorrect board, but this is caused by player error (the solving algorithmn works))
    //solve it again from the starting board
    if(!BruteForceSudoku(solvedBoard) || !VerifyBoard(solvedBoard))
    {
        //Copy the starting board onto the board to solve
        Slice2DArray(startingBoard, solvedBoard);

        FindViableChecks(solvedBoard);

        if(!BruteForceSudoku(solvedBoard))
        {
            console.log("BUG: It failed to solve the board from the correct starting board, this should be impossible!");
        }
        else
        {
            //Copy the solved board into the displayed board
            Slice2DArray(solvedBoard, board);
        }
    }
    else
    {
        //Copy the solved board into the displayed board
        Slice2DArray(solvedBoard, board);
    }

    //Create a new board with the correct solved numbers
    CreateGameBoard();

    //Get a reference to all the HTML tiles
    let boardTiles = qsa(".tile");

    //Deselect the board tile
    boardTiles[selectedBoardTilePos].classList.remove("selected");
    foundSelected = false;
    selectedTile = null;
    
    //Iterate over board
    for (let x = 0; x < MBS; x++)
    {
        for (let y = 0; y < MBS; y++)
        {
            if(startingBoard[x][y] == 0)
            {
                //The tiles are not the  same number so the player didn't solve this number
                let solvedTile = boardTiles[x * MBS + y];

                solvedTile.classList.remove("selected");
                solvedTile.classList.remove("incorrect");
                solvedTile.classList.add("correct");
            }
        }
    }
}

function CreateGameBoard()
{
    ClearPreviousGame();

    //Counts the number of tiles so we can set their id's
    let idCount = 0;

    //Create the 81 board tiles
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
                            let boardTiles = qsa(".tile");

                            boardTiles[selectedBoardTilePos].classList.remove("selected");
                            foundSelected = true;

                            //Add selection and update
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
        let row = Math.floor(selectedBoardTilePos / 9);
        let column = selectedBoardTilePos % 9;

        //Update the board position
        board[row][column] = parseInt(selectedNum.textContent, 10);
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
//Can be used like let arr = CreateArray(9, 9, 1);
//Creates a 9x9 3D array with 1 element in the third dimension
function CreateArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
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
    for(let i = 0; i < originalArr.length; i++)
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