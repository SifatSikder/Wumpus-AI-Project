const EAST = [1, 0]
const WEST = [-1, 0]
const NORTH = [0, 1]
const SOUTH = [0, -1]
const CLEAR = -1
const DIRECTIONS = [NORTH, SOUTH, EAST, WEST];

var moves = []
var turns = []
var gliterPosition = [];

var pathMap = [];
var wumpusMap = [];
var pitMap = [];

function initializeBoard(size) {
    var board = [];
    for (let i = 0; i < size; i++) {
        var row = [];
        for (let j = 0; j < size; j++) {
            row.push(0);
        }
        board.push(row)
    }
    return board
}



function createKnowledgeBase(size, position) {
    pathMap = initializeBoard(size)
    wumpusMap = initializeBoard(size)
    pitMap = initializeBoard(size)
    tellClear(position)
}

function registerMove(move) {

    moves.push(move);
    let x = move[0]
    let y = move[1]
    wumpusMap[x][y] = CLEAR;
    pitMap[x][y] = CLEAR;
    pathMap[x][y]++;
}

//direction =0 for left turn and 1 for right turn
function registerTurn(direction) {
    if (direction == 0 || direction == 1) {
        turns.push(direction)
    }
}



function askPath(position) {
    try {
        return pathMap[position[0]][position[1]];
    } catch (e) {
        return 100;
    }
}

function askWumpus(position) {
    try {
        return wumpusMap[position[0]][position[1]];
    } catch (e) {
        return 100;
    }
}

function askPit(position) {
    try {
        return pitMap[position[0]][position[1]];
    } catch (e) {
        return 100;
    }
}

function tellStench(position) {
    let x = position[0]
    let y = position[1]
    if (pathMap[x][y] <= 1) {

        // ensure that the neighboring cell is on the map
        //if yes then increase the square value by 1 in the map
        DIRECTIONS.forEach(direction => {
            x = position[0] + direction[0]
            y = position[1] + direction[1]
            if (x >= 0 && x < wumpusMap.length && y >= 0 && y < wumpusMap.length) {
                wumpusMap[x][y]++;
            }
        });
    }
}

function tellBreeze(position) {
    let x = position[0]
    let y = position[1]
    if (pathMap[x][y] <= 1) {
        DIRECTIONS.forEach(direction => {
            x = position[0] + direction[0]
            y = position[1] + direction[1]
            if (x >= 0 && x < pitMap.length && y >= 0 && y < pitMap.length) {
                pitMap[x][y]++;
            }
        });
    }
}

function tellClear(position) {

    DIRECTIONS.forEach(direction => {
        x = position[0] + direction[0]
        y = position[1] + direction[1]
        if (x >= 0 && x < pathMap.length && y >= 0 && y < pathMap.length) {
            wumpusMap[x][y] = CLEAR;
            pitMap[x][y] = CLEAR;
        }
    });
}

function tellPitClear(position) {

    DIRECTIONS.forEach(direction => {
        x = position[0] + direction[0]
        y = position[1] + direction[1]
        if (x >= 0 && x < pathMap.length && y >= 0 && y < pathMap.length) {
            pitMap[x][y] = CLEAR;
        }
    });
}
function tellWumpusClear(position) {

    DIRECTIONS.forEach(direction => {
        x = position[0] + direction[0]
        y = position[1] + direction[1]
        if (x >= 0 && x < pathMap.length && y >= 0 && y < pathMap.length) {
            wumpusMap[x][y] = CLEAR;
        }
    });
}




function tellGlitter(position) {
    gliterPosition[0] = position[0]
    gliterPosition[1] = position[1]
}

function askGlitter(position) {
    if (gliterPosition[0] == position[0] && gliterPosition[1] == position[1]) {
        return true;
    } else {
        return false;
    }
}

function tellScream(position, direction) {
    // ASSUMPTION: Clears all wumpus' until it hits an obstacle or a wall
    let x = position[0]
    let y = position[1]
    while (x < wumpusMap.length && y < wumpusMap.length) {
        wumpusMap[x][y] = CLEAR;
        x = x + direction[0];
        y = y + direction[1];
    }

}

function print() {
    let x = 0;
    let y = 0;
    let result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    // print the values for each cell
    for (y = pathMap.length - 1; y >= 0; y--) {
        if (x == 0) {
            process.stdout.write(y + "|");
        }
        for (x = 0; x < pathMap.length; x++) {
            let row = []
            let lastX = moves[moves.length - 1][0];
            let lastY = moves[moves.length - 1][1];
            if (lastX == x && lastY == y) {
                process.stdout.write("o "); //where is the agent right now
                result[x][y] = 'o'
            } else if (pathMap[x][y] > 0) {
                process.stdout.write("+ "); //all visited squares
                result[x][y] = '+'
            } else if (wumpusMap[x][y] < 0 && pitMap[x][y] < 0) {
                process.stdout.write("  "); //clear squares
                result[x][y] = ' '
            } else if (wumpusMap[x][y] == 0 && pitMap[x][y] == 0) {
                process.stdout.write("? "); //confused
                result[x][y] = '?'
            } else if (wumpusMap[x][y] >= pitMap[x][y]) {
                process.stdout.write("w "); //wumpus
                result[x][y] = 'w'
            } else if (pitMap[x][y] > 0) {
                process.stdout.write("p "); // pit
                result[x][y] = 'p'
            }
        }
        x = 0;
        console.log();
    }
    process.stdout.write(" ");
    for (let i = 0; i < pathMap.length; i++) {
        process.stdout.write("--");
    }
    process.stdout.write("\n ");
    for (let i = 0; i < pathMap.length; i++) {
        process.stdout.write(" " + i);
    }
    console.log();
    console.log(result);
}


module.exports = {
    createKnowledgeBase,
    registerMove,
    registerTurn,
    askPath,
    askWumpus,
    askPit,
    tellStench,
    tellBreeze,
    tellGlitter,
    tellClear,
    tellPitClear,
    tellWumpusClear,
    askGlitter,
    tellScream,
    print,

    moves: () => moves,
    turns: () => turns,
    gliterPosition: () => gliterPosition,

    pathMap: () => pathMap,
    wumpusMap: () => wumpusMap,
    pitMap: () => pitMap,
    EAST, WEST, NORTH, SOUTH, DIRECTIONS
}


// createKnowledgeBase(4)
// registerMove([0, 0])
// registerMove([1, 0])
// tellClear([1, 0]);
// registerMove([2, 0]);
// tellStench([2, 0]);
// tellClear([0, 0]);
// tellClear([0, 1]);
// tellStench([0, 2]);
// tellClear([0, 1]);
// tellClear([0, 0]);
// tellClear([1, 0]);
// tellClear([2, 0]);
// tellBreeze([3, 0]);
// tellClear([3, 1]);
// tellStench([3, 2]);
// print();
