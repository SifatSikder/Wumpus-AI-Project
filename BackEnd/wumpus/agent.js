const knowledgeBase = require('./knowledgeBase')
var game;
var size;
const left = 0
const right = 1

var position = [];
var direction = [];
var directions = [];
var stench, breeze, died, scream, glitter, haveGold, remainingArrows;

function sendInfo() {
    return {
        pathMap: knowledgeBase.pathMap(),
        wumpusMap: knowledgeBase.wumpusMap(),
        pitMap: knowledgeBase.pitMap(),
        moves: knowledgeBase.moves(),
        turns: knowledgeBase.turns(),
        gliterPosition: knowledgeBase.gliterPosition(),
        currentPosition: position,
        currentDirection: direction,
        breeze: breeze,
        stench: stench,
        glitter: glitter,
        scream: scream,
        remainingArrows: remainingArrows,
        died: died,
        haveGold: haveGold
    }
}

function start(GAME) {
    game = GAME
    size = game.size()
    knowledgeBase.createKnowledgeBase(game.size(), position)
    direction = knowledgeBase.NORTH;
    directions.push(direction);
    knowledgeBase.registerMove([position[0], position[1]]);
    stench = false;
    breeze = false;
    glitter = false;
    haveGold = false;
    died = false;
    scream = false;
    directions = [];
}

function processPercepts(position) {
    //add percepts to knowledge base
    if (glitter)
        knowledgeBase.tellGlitter(position);
    if (breeze)
        knowledgeBase.tellBreeze(position);
    if (stench)
        knowledgeBase.tellStench(position);
    if (!breeze)
        knowledgeBase.tellPitClear(position);
    if (!stench)
        knowledgeBase.tellWumpusClear(position);

}

function move() {

    game.moveAgent()
    directions.push(direction)
    if (!died) {
        knowledgeBase.registerMove([position[0], position[1]]);
        processPercepts([position[0], position[1]]);
    }
}

function turn(direction) {
    game.turnAgent(direction);
    knowledgeBase.registerTurn(direction);
}

function setValueInADirection(map, position, direction, value) {

    let [ROW, COL] = position
    if (direction[0] == knowledgeBase.NORTH[0] && direction[1] == knowledgeBase.NORTH[1]) {
        for (let col = COL; col < map.length; col++) {
            map[ROW][col] = value;
            knowledgeBase.wumpusPermanentlyCleared().push([ROW, col])
        }
    }
    else if (direction[0] == knowledgeBase.SOUTH[0] && direction[1] == knowledgeBase.SOUTH[1]) {
        for (let col = COL; col >= 0; col--) {
            map[ROW][col] = value;
            knowledgeBase.wumpusPermanentlyCleared().push([ROW, col])
        }
    }
    else if (direction[0] == knowledgeBase.EAST[0] && direction[1] == knowledgeBase.EAST[1]) {
        for (let row = ROW; row < map.length; row++) {
            map[row][COL] = value;
            knowledgeBase.wumpusPermanentlyCleared().push([row, COL])
        }
    }
    else if (direction[0] == knowledgeBase.WEST[0] && direction[1] == knowledgeBase.WEST[1]) {
        for (let row = ROW; row > -1; row--) {
            map[row][COL] = value;
            knowledgeBase.wumpusPermanentlyCleared().push([row, COL])

        }
    }

}

function shoot() {
    remainingArrows--;
    console.log("Agent loosed an arrow.");
    game.processShot();
    setValueInADirection(knowledgeBase.wumpusMap(), position, direction, knowledgeBase.CLEAR)


}

function pickGold() {
    game.agentGrabsGold();
    haveGold = true
    console.log("Agent picked up the gold.");
}

function existingUnvisitedAndSafeSquare(position) {
    let directions = knowledgeBase.DIRECTIONS
    for (let j = 0; j < directions.length; j++) {
        let x = position[0] + directions[j][0];
        let y = position[1] + directions[j][1];
        //check for vaild and unvisited cell which is a neighbour of a move 
        if (isValidPosition([x, y]) && knowledgeBase.askPath([x, y]) == 0) {
            //check wheather it is safe or not
            if (knowledgeBase.askWumpus([x, y]) + knowledgeBase.askPit([x, y]) <= -2) {
                return true;
            }
        }
    }
    return false;
}

function lookBack(riskFactor) {
    let directions = knowledgeBase.DIRECTIONS;
    for (let i = knowledgeBase.moves().length - 1; i >= 0; i--) {
        let position = knowledgeBase.moves()[i];


        for (let j = 0; j < directions.length; j++) {
            let x = position[0] + directions[j][0];
            let y = position[1] + directions[j][1];
            //check for vaild and unvisited cell which is a neighbour of a move 
            if (isValidPosition([x, y]) && knowledgeBase.askPath([x, y]) == 0) {
                // And it match
                if (knowledgeBase.askWumpus([x, y]) + knowledgeBase.askPit([x, y]) <= riskFactor) {
                    console.log("lookback succeeded");
                    return i;
                }
            }
        }
    }
    console.log("lookback failed");
    return -1;
}

function turnBackward() {
    turn(left)
    turn(left)
}

function isTwoPositionSame(position1, position2) {
    return position1[0] == position2[0] && position1[1] == position2[1]
}

function backtrack(moves, riskFactor) {
    let i = lookBack(riskFactor);
    if (i < 0) {
        return false;
    }

    let cell = moves[i]; //which cell to backtrack
    console.log("backtracking to [ " + cell[0] + "," + cell[1] + " ]");

    let prevDirections = directions.slice()
    let prevTurns = knowledgeBase.turns().slice()
    currentDirection = prevDirections[prevDirections.length - 1]
    turnBackward()
    for (let i = prevDirections.length - 2; i >= 0; i--) {
        if (isTwoPositionSame(currentDirection, prevDirections[i])) {
            move()
            if (died) {
                console.log(knowledgeBase.moves());
                process.exit(0)
            }
            if (isTwoPositionSame(position, cell)) return true
        } else {
            let currentTurn = prevTurns.pop()
            if (currentTurn == 0) {
                turn(right)
            } else turn(left)
        }
        currentDirection = prevDirections[i]
    }
}

function anyloopsituation() {

    let loop = true;
    let squares = validSquares(position)


    let allVisited = true;
    for (let i = 0; i < squares.length; i++) {
        if (!knowledgeBase.alreadyVisited(squares[i])) {
            allVisited = false;
            break;
        }
    }

    if (allVisited) return false
    else {

        for (let i = 0; i < squares.length; i++) {
            // let noWumpusButPit = (knowledgeBase.askWumpus(squares[i]) == knowledgeBase.CLEAR) && (knowledgeBase.askPit(squares[i]) != knowledgeBase.CLEAR)
            // let noPitButWumpus = (knowledgeBase.askWumpus(squares[i]) != knowledgeBase.CLEAR) && (knowledgeBase.askPit(squares[i]) == knowledgeBase.CLEAR)
            let isWumpus = (knowledgeBase.askWumpus(squares[i]) != knowledgeBase.CLEAR)
            let isPit = (knowledgeBase.askPit(squares[i]) != knowledgeBase.CLEAR)
            if ((!isWumpus && !isPit) && !knowledgeBase.alreadyVisited(squares[i])) {
                loop = false;
                break;
            }
        }
        return loop
    }

}

function WumpusloopSituation() {
    let loop = true;
    let squares = validSquares(position)


    let allVisited = true;
    for (let i = 0; i < squares.length; i++) {
        if (!knowledgeBase.alreadyVisited(squares[i])) {
            allVisited = false;
            break;
        }
    }

    if (allVisited) return false
    else {

        for (let i = 0; i < squares.length; i++) {
            if (knowledgeBase.askWumpus(squares[i]) == knowledgeBase.CLEAR && !knowledgeBase.alreadyVisited(squares[i])) {
                loop = false;
                break;
            }
        }
        return loop
    }

}

function pitloopSituation() {
    let loop = true;
    let squares = validSquares(position)


    let allVisited = true;
    for (let i = 0; i < squares.length; i++) {
        if (!knowledgeBase.alreadyVisited(squares[i])) {
            allVisited = false;
            break;
        }
    }

    if (allVisited) return false
    else {

        for (let i = 0; i < squares.length; i++) {
            if (knowledgeBase.askPit(squares[i]) == knowledgeBase.CLEAR && !knowledgeBase.alreadyVisited(squares[i])) {
                loop = false;
                break;
            }
        }
        return loop
    }

}

function loopBreak() {
    if (remainingArrows <= 0) return false;
    let valid_squares = validSquares(position)
    let unvisited_squares = []
    valid_squares.forEach((square) => {

        let duplicate = false;
        for (let i = 0; i < knowledgeBase.moves().length; i++) {
            if (knowledgeBase.moves()[i][0] == square[0] && knowledgeBase.moves()[i][1] == square[1]) {
                duplicate = true;
                break;
            }
        }
        if (!duplicate) unvisited_squares.push(square)
    })

    let probableWumpusSquare = unvisited_squares[0]
    for (let i = 1; i < unvisited_squares.length; i++) {
        if (knowledgeBase.askWumpus(unvisited_squares[i]) > knowledgeBase.askWumpus(probableWumpusSquare))
            probableWumpusSquare = unvisited_squares[i]
    }


    //find the direction by subtracting current position from final location(probableWumpusSquare) 
    let row = probableWumpusSquare[0] - position[0]
    let col = probableWumpusSquare[1] - position[1]

    if (row == 0 && col == 1) {
        direction = knowledgeBase.NORTH
        directions.push(direction);
    }
    else if (row == 0 && col == -1) {
        direction = knowledgeBase.SOUTH
        directions.push(direction);
    }

    else if (row == 1 && col == 0) {
        direction = knowledgeBase.EAST
        directions.push(direction);
    }

    else if (row == -1 && col == 0) {
        direction = knowledgeBase.WEST
        directions.push(direction);
    }


    shoot();
    return true

}

function play() {
    if (knowledgeBase.askGlitter([position[0], position[1]])) {
        pickGold();
        return;
    }
    let riskFactor = -2;
    let movePossible = true;
    let forwardScore, leftScore, rightScore;
    while (true) {
        console.log("Status:\n\tCurrent position:[" + position[0] + "," + position[1] + "]\n\tCurrent direction:{" + direction[0] + "," + direction[1] + "}\n\triskFactor:" + riskFactor);




        if (movePossible) {
            // get dangerScore for each surrounding cell
            forwardScore = Number.MAX_VALUE
            leftScore = Number.MAX_VALUE
            rightScore = Number.MAX_VALUE
            if (equals(direction, knowledgeBase.NORTH)) {
                if (isValidPosition([position[0], position[1] + 1]))
                    forwardScore = knowledgeBase.askWumpus([position[0], position[1] + 1]) + knowledgeBase.askPit([position[0], position[1] + 1]) + knowledgeBase.askPath([position[0], position[1] + 1]);
                if (isValidPosition([position[0] + 1, position[1]]))
                    rightScore = knowledgeBase.askWumpus([position[0] + 1, position[1]]) + knowledgeBase.askPit([position[0] + 1, position[1]]) + knowledgeBase.askPath([position[0] + 1, position[1]]);
                if (isValidPosition([position[0] - 1, position[1]]))
                    leftScore = knowledgeBase.askWumpus([position[0] - 1, position[1]]) + knowledgeBase.askPit([position[0] - 1, position[1]]) + knowledgeBase.askPath([position[0] - 1, position[1]]);
            } else if (equals(direction, knowledgeBase.SOUTH)) {
                if (isValidPosition([position[0], position[1] - 1]))
                    forwardScore = knowledgeBase.askWumpus([position[0], position[1] - 1]) + knowledgeBase.askPit([position[0], position[1] - 1]) + knowledgeBase.askPath([position[0], position[1] - 1]);
                if (isValidPosition([position[0] - 1, position[1]]))
                    rightScore = knowledgeBase.askWumpus([position[0] - 1, position[1]]) + knowledgeBase.askPit([position[0] - 1, position[1]]) + knowledgeBase.askPath([position[0] - 1, position[1]]);
                if (isValidPosition([position[0] + 1, position[1]]))
                    leftScore = knowledgeBase.askWumpus([position[0] + 1, position[1]]) + knowledgeBase.askPit([position[0] + 1, position[1]]) + knowledgeBase.askPath([position[0] + 1, position[1]]);
            } else if (equals(direction, knowledgeBase.EAST)) {
                if (isValidPosition([position[0] + 1, position[1]]))
                    forwardScore = knowledgeBase.askWumpus([position[0] + 1, position[1]]) + knowledgeBase.askPit([position[0] + 1, position[1]]) + knowledgeBase.askPath([position[0] + 1, position[1]]);
                if (isValidPosition([position[0], position[1] - 1]))
                    rightScore = knowledgeBase.askWumpus([position[0], position[1] - 1]) + knowledgeBase.askPit([position[0], position[1] - 1]) + knowledgeBase.askPath([position[0], position[1] - 1]);
                if (isValidPosition([position[0], position[1] + 1]))
                    leftScore = knowledgeBase.askWumpus([position[0], position[1] + 1]) + knowledgeBase.askPit([position[0], position[1] + 1]) + knowledgeBase.askPath([position[0], position[1] + 1]);
            } else if (equals(direction, knowledgeBase.WEST)) {
                if (isValidPosition([position[0] - 1, position[1]]))
                    forwardScore = knowledgeBase.askWumpus([position[0] - 1, position[1]]) + knowledgeBase.askPit([position[0] - 1, position[1]]) + knowledgeBase.askPath([position[0] - 1, position[1]]);
                if (isValidPosition([position[0], position[1] + 1]))
                    rightScore = knowledgeBase.askWumpus([position[0], position[1] + 1]) + knowledgeBase.askPit([position[0], position[1] + 1]) + knowledgeBase.askPath([position[0], position[1] + 1]);
                if (isValidPosition([position[0], position[1] - 1]))
                    leftScore = knowledgeBase.askWumpus([position[0], position[1] - 1]) + knowledgeBase.askPit([position[0], position[1] - 1]) + knowledgeBase.askPath([position[0], position[1] - 1]);
            }
        }






        console.log("\tforwardDanger:" + forwardScore + "\n\trightDanger:" + rightScore + "\n\tleftDanger:" + leftScore);
        // if a move forward/right/left is less than the risk factor, make the move.

        // if (forwardScore == Number.MAX_VALUE && leftScore == Number.MAX_VALUE && rightScore == Number.MAX_VALUE) {
        //     console.log('Code is here');
        //     let randomMove = Math.floor(Math.random() * 3) + 1
        //     if (randomMove == 2) {
        //         turn(left)
        //     }
        //     if (randomMove == 3) {
        //         turn(right)
        //     }
        //     move();
        //     movePossible = true
        //     knowledgeBase.print();
        //     return;
        // }


        if (forwardScore <= riskFactor && forwardScore <= leftScore && forwardScore <= rightScore) {
            let x = position[0] + direction[0]
            let y = position[1] + direction[1]
            if (knowledgeBase.askPath([x, y]) <= 0 || existingUnvisitedAndSafeSquare([x, y])) {
                move();

                movePossible = true
                knowledgeBase.print();
                knowledgeBase.printMap(knowledgeBase.wumpusMap());
                knowledgeBase.printMap(knowledgeBase.pitMap());
                knowledgeBase.printMap(knowledgeBase.pathMap());
                return;
            }
            movePossible = false
            forwardScore = Number.MAX_VALUE


        } else if (leftScore <= riskFactor && leftScore <= rightScore) {
            turn(left);
            let x = position[0] + direction[0]
            let y = position[1] + direction[1]
            if (knowledgeBase.askPath([x, y]) <= 0 || existingUnvisitedAndSafeSquare([x, y])) {
                move();
                movePossible = true
                knowledgeBase.print();
                knowledgeBase.printMap(knowledgeBase.wumpusMap());
                knowledgeBase.printMap(knowledgeBase.pitMap());
                knowledgeBase.printMap(knowledgeBase.pathMap());
                return;
            }
            turn(right);
            movePossible = false
            leftScore = Number.MAX_VALUE
        } else if (rightScore <= riskFactor) {
            turn(right);
            let x = position[0] + direction[0]
            let y = position[1] + direction[1]
            if (knowledgeBase.askPath([x, y]) <= 0 || existingUnvisitedAndSafeSquare([x, y])) {
                move();
                movePossible = true
                knowledgeBase.print();
                knowledgeBase.printMap(knowledgeBase.wumpusMap());
                knowledgeBase.printMap(knowledgeBase.pitMap());
                knowledgeBase.printMap(knowledgeBase.pathMap());
                return;
            }
            turn(left);
            movePossible = false
            rightScore = Number.MAX_VALUE
        } else {
            let backtracked = backtrack(knowledgeBase.moves(), riskFactor);
            if (backtracked) {
                console.log("\tbacktracked");
                return;
            } else {
                console.log("\tNo suitable backtrack found");

                if (WumpusloopSituation()) {
                    if (loopBreak()) {
                        return;
                    }
                }
                else if (pitloopSituation()) {
                    console.log('pit loop situation');
                }
                else if (anyloopsituation()) {
                    if (loopBreak()) {
                        return;
                    }
                }
            }
        }
        riskFactor++;
    }


}


function equals(array1, array2) {
    if (array1.length == array2.length) {
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) return false
        }
    }
    return true
}

function isValidPosition(position) {
    let x = position[0]
    let y = position[1]
    if (x >= 0 && x < game.size() && y >= 0 && y < game.size())
        return true
    return false
}

function validSquares(position) {
    let x = position[0]
    let y = position[1]
    let results = []
    if (x - 1 >= 0 && x - 1 < size && y >= 0 && y < size) results.push([x - 1, y])
    if (x + 1 >= 0 && x + 1 < size && y >= 0 && y < size) results.push([x + 1, y])
    if (x >= 0 && x < size && y + 1 >= 0 && y + 1 < size) results.push([x, y + 1])
    if (x >= 0 && x < size && y - 1 >= 0 && y - 1 < size) results.push([x, y - 1])
    return results
}




module.exports = {

    equals,
    start,
    sendInfo,
    play,

    left: () => left,
    right: () => right,

    getPosition: () => position,
    getHaveGold: () => haveGold,
    getDirection: () => direction,
    getStench: () => stench,
    getBreeze: () => breeze,
    getGlitter: () => glitter,
    getDied: () => died,
    getScream: () => scream,
    getRemainingArrows: () => remainingArrows,


    setPosition: (value) => position = value,
    setDirection: (value) => direction = value,
    setDirections: (value) => directions.push(value),
    setStench: (value) => stench = value,
    setBreeze: (value) => breeze = value,
    setGlitter: (value) => glitter = value,
    setDied: (value) => died = value,
    setHaveGold: (value) => haveGold = value,
    setScream: (value) => scream = value,
    setRemainingArrows: (value) => remainingArrows = value,
}
