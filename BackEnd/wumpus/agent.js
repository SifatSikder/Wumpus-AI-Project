const knowledgeBase = require('./knowledgeBase')
var game;
const left = 0
const right = 1

var position = [];
var direction = [];
var stench, breeze, died, scream, glitter, haveGold, remainingArrows;

function start(GAME) {
    game = GAME
    knowledgeBase.createKnowledgeBase(4)
    direction = knowledgeBase.NORTH;
    knowledgeBase.registerMove([position[0], position[1]]);
    while (true) {
        play();
    }
}

function move() {

    game.moveAgent()
    knowledgeBase.registerMove([position[0], position[1]]);
    processPercepts(x, y);
}

function processPercepts(position) {
    //add percepts to knowledge base
    if (glitter)
        knowledgeBase.tellGlitter(position);
    if (breeze)
        knowledgeBase.tellBreeze(position);
    if (stench)
        knowledgeBase.tellStench(position);
    if (!breeze && !stench)
        knowledgeBase.tellClear(position);

}

function turn(direction) {
    game.turnAgent(direction);
    knowledgeBase.registerTurn(direction);
}

function shoot() {
    remainingArrows--;
    console.log("Agent loosed an arrow.");
    game.processShot();
    processPercepts(position[0], position[1]);
}

function pickGold() {
    game.agentGrabsGold();
    console.log("Agent picked up the gold.");
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

function play() {
    if (knowledgeBase.askGlitter([position[0], position[1]])) {
        pickGold();
        return;
    }
    let riskFactor = -2;
    while (true) {
        console.log("infer()\n\tpos:[" + position[0] + "," + position[1] + "]\n\tdirection:{" + direction[0] + "," + direction[1] + "}\n\triskFactor:" + riskFactor);

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
            // let backtracked = backtrack(knowledgeBase.moveStack, riskFactor);
            // if (backtracked) {
            //     console.log("\tbacktracked");
            //     return;
            // } else {
            //     console.log("\tNo suitable backtrack found");
            // }
        }
        riskFactor++;
    }


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
