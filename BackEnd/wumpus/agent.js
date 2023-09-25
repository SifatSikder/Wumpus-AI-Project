const knowledgeBase = require('./knowledgeBase')
var game;
var size;
const left = 0
const right = 1

var position = [];
var direction = [];
var stench, breeze, died, scream, glitter, haveGold, remainingArrows;

function start(GAME) {
    game = GAME
    size = game.size()
    knowledgeBase.createKnowledgeBase(game.size(), position)
    direction = knowledgeBase.NORTH;
    knowledgeBase.registerMove([position[0], position[1]]);
    while (!haveGold && !died) {
        play();
    }
    console.log(knowledgeBase.moves());
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
        }
    }
    else if (direction[0] == knowledgeBase.SOUTH[0] && direction[1] == knowledgeBase.SOUTH[1]) {
        for (let col = COL; col >= 0; col--) {
            map[ROW][col] = value;
        }
    }
    else if (direction[0] == knowledgeBase.EAST[0] && direction[1] == knowledgeBase.EAST[1]) {
        for (let row = ROW; row < map.length; row++) {
            map[row][COL] = value;
        }
    }
    else if (direction[0] == knowledgeBase.WEST[0] && direction[1] == knowledgeBase.WEST[1]) {
        for (let row = ROW; row > -1; row--) {
            map[row][COL] = value;
        }
    }

}


function shoot() {
    remainingArrows--;
    console.log("Agent loosed an arrow.");
    game.processShot();
    if (scream) {
        setValueInADirection(knowledgeBase.wumpusMap(), position, direction, knowledgeBase.CLEAR)
    }

    // processPercepts([position[0], position[1]]);
}

function pickGold() {
    game.agentGrabsGold();
    haveGold = true
    console.log("Agent picked up the gold.");
}

function lookBack(riskFactor) {
    let directions = knowledgeBase.DIRECTIONS;
    for (let i = knowledgeBase.moves().length - 1; i >= 0; i--) {
        let position = knowledgeBase.moves()[i];


        for (let j = 0; j < directions.length; j++) {
            let x = position[0] + directions[j][0];
            let y = position[1] + directions[j][1];
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

function backtrack(moves, riskFactor) {
    let i = lookBack(riskFactor);
    if (i < 0) {
        return false;
    }

    let cell = moves[i];
    console.log("backtracking to [ " + cell[0] + "," + cell[1] + " ]");
    let tempMoves = moves
    let tempTurns = knowledgeBase.turns()
    console.log("moves.size:" + tempMoves.length + "\tturns.size:" + tempTurns.length);
    try {
        turn(left);
        turn(left);
        move();
        while (position[0] != cell[0] || position[1] != cell[1]) {
            let nextMove = tempMoves[tempMoves.length - 1];
            if (position[0] + direction[0] == nextMove[0] && position[1] + direction[1] == nextMove[1]) {
                move();
                tempMoves.pop()
            } else {
                let turn = tempTurns[tempTurns.length - 1];
                if (turn == left) {
                    turn(right);
                    tempTurns.pop()
                } else if (turn == right) {
                    turn(left);
                    tempTurns.pop();
                }
            }
        }
        return true;
    } catch (e) {
        return false;
    }
}

function loopBreak() {
    let valid_squares = validSquares(position)
    let squares = []
    valid_squares.forEach((square) => {

        let duplicate = false;
        for (let i = 0; i < knowledgeBase.moves().length; i++) {
            if (knowledgeBase.moves()[i][0] == square[0] && knowledgeBase.moves()[i][1] == square[1]) {
                duplicate = true;
                break;
            }
        }
        if (!duplicate) squares.push(square)
    })

    let probableWumpusSquare = squares[0]
    for (let i = 1; i < squares.length; i++) {
        if (knowledgeBase.askWumpus(squares[i]) > knowledgeBase.askWumpus(probableWumpusSquare))
            probableWumpusSquare = squares[i]
    }


    //find the direction by subtracting current position from final location(probableWumpusSquare) 
    direction[0] = probableWumpusSquare[0] - position[0]
    direction[1] = probableWumpusSquare[1] - position[1]

    shoot()
}

function play() {
    if (knowledgeBase.askGlitter([position[0], position[1]])) {
        pickGold();
        return;
    }
    let riskFactor = -2;
    while (true) {
        console.log("Status:\n\tCurrent position:[" + position[0] + "," + position[1] + "]\n\tCurrent direction:{" + direction[0] + "," + direction[1] + "}\n\triskFactor:" + riskFactor);

        // get dangerScore for each surrounding cell
        let forwardScore = Number.MAX_VALUE
        let leftScore = Number.MAX_VALUE;
        let rightScore = Number.MAX_VALUE;
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

        console.log("\tforwardDanger:" + forwardScore + "\n\trightDanger:" + rightScore + "\n\tleftDanger:" + leftScore);

        // if a move forward/right/left is less than the risk factor, make the move.
        if (forwardScore <= riskFactor && forwardScore <= leftScore && forwardScore <= rightScore) {
            move();
            knowledgeBase.print();
            return;
        } else if (leftScore <= riskFactor && leftScore <= rightScore) {
            turn(left);
            move();
            knowledgeBase.print();
            return;
        } else if (rightScore <= riskFactor) {
            turn(right);
            move();
            knowledgeBase.print();
            return;
        } else {
            let backtracked = backtrack(knowledgeBase.moves(), riskFactor);
            if (backtracked) {
                console.log("\tbacktracked");
                return;
            } else {
                console.log("\tNo suitable backtrack found");
                loopBreak();
                return;
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

    left: () => left,
    right: () => right,

    getPosition: () => position,
    getDirection: () => direction,
    getStench: () => stench,
    getBreeze: () => breeze,
    getGlitter: () => glitter,
    getDied: () => died,
    getScream: () => scream,
    getRemainingArrows: () => remainingArrows,


    setPosition: (value) => position = value,
    setDirection: (value) => direction = value,
    setStench: (value) => stench = value,
    setBreeze: (value) => breeze = value,
    setGlitter: (value) => glitter = value,
    setDied: (value) => died = value,
    setScream: (value) => scream = value,
    setRemainingArrows: (value) => remainingArrows = value,
}
