const world = require("./world");
var agent;
const knowledgeBase = require('./knowledgeBase')

var size, score;

function createGame(SIZE, wumpusProbablity, pitProbablity, AGENT) {
    size = SIZE
    score = 1000
    agent = AGENT
    world.generateWorld(size, wumpusProbablity, pitProbablity);
    agent.setPosition(world.startingPosition())
    agent.setRemainingArrows(world.numberOfWumpus())
    return world.world()
}


function setGame(board, AGENT) {
    size = board.length
    score = 1000
    agent = AGENT
    world.setWorld(board);
    agent.setPosition(world.startingPosition())
    agent.setRemainingArrows(world.numberOfWumpus())
    return world.world()
}


function setStench(POSITION) {

    let stench = false;
    validSquares(POSITION).forEach(position => {
        if (world.world()[position[0]][position[1]] == 1) {
            stench = true
        }
    })
    agent.setStench(stench);

}


function setBreeze(POSITION) {

    let breeze = false;
    validSquares(POSITION).forEach(position => {
        if (world.world()[position[0]][position[1]] == 2) {
            breeze = true
        }
    })
    agent.setBreeze(breeze);

}

function setGlitter(POSITION) {

    if (world.world()[POSITION[0]][POSITION[1]] == 3)
        agent.setGlitter(true)

    else
        agent.setGlitter(false)

}


function moveAgent() {
    let oldPosition = agent.getPosition()
    let x = oldPosition[0] + agent.getDirection()[0]
    let y = oldPosition[1] + agent.getDirection()[1]

    if (world.world()[x][y] == 1 || world.world()[x][y] == 2) {
        score -= 1000;
        agent.setDied(true)
        console.log('agent died');
        return
    }
    agent.setPosition([x, y])

    setStench([x, y])
    setBreeze([x, y])
    setGlitter([x, y])

    score--;
    return true;
}

function turnAgent(direction) {
    if (direction == agent.left()) {
        console.log("Agent turned left.");
        if (agent.equals(agent.getDirection(), knowledgeBase.NORTH)) {

            agent.setDirection(knowledgeBase.WEST);
            agent.setDirections(knowledgeBase.WEST)
        }
        else if (agent.equals(agent.getDirection(), knowledgeBase.EAST)) {

            agent.setDirection(knowledgeBase.NORTH);
            agent.setDirections(knowledgeBase.NORTH)
        }
        else if (agent.equals(agent.getDirection(), knowledgeBase.SOUTH)) {

            agent.setDirection(knowledgeBase.EAST);
            agent.setDirections(knowledgeBase.EAST)
        }
        else if (agent.equals(agent.getDirection(), knowledgeBase.WEST)) {

            agent.setDirection(knowledgeBase.SOUTH);
            agent.setDirections(knowledgeBase.SOUTH)
        }
    }



    if (direction == agent.right()) {
        console.log("Agent turned right.");
        if (agent.equals(agent.getDirection(), knowledgeBase.NORTH)) {

            agent.setDirection(knowledgeBase.EAST);
            agent.setDirections(knowledgeBase.EAST)
        }
        else if (agent.equals(agent.getDirection(), knowledgeBase.EAST)) {

            agent.setDirection(knowledgeBase.SOUTH);
            agent.setDirections(knowledgeBase.SOUTH)
        }
        else if (agent.equals(agent.getDirection(), knowledgeBase.SOUTH)) {

            agent.setDirection(knowledgeBase.WEST);
            agent.setDirections(knowledgeBase.WEST)
        }
        else if (agent.equals(agent.getDirection(), knowledgeBase.WEST)) {

            agent.setDirection(knowledgeBase.NORTH);
            agent.setDirections(knowledgeBase.NORTH)
        }
    }
    score--;
}

function processShot() {


    let [ROW, COL] = agent.getPosition()

    if (agent.equals(agent.getDirection(), knowledgeBase.NORTH)) {
        for (let col = COL; col < world.world().length; col++) {
            if (world.world()[ROW][col] == 1) {
                world.setSquare([ROW, col], -1)
                agent.setScream(true)
            }
        }
        agent.setScream(false)

    }

    else if (agent.equals(agent.getDirection(), knowledgeBase.SOUTH)) {

        for (let col = COL; col >= 0; col--) {
            if (world.world()[ROW][COL] == 1) {
                world.setSquare([ROW, col], -1)
                agent.setScream(true)

            }
        }
        agent.setScream(false)
    }

    else if (agent.equals(agent.getDirection(), knowledgeBase.EAST)) {

        for (let row = ROW; row < world.world().length; row++) {
            if (world.world()[row][COL] == 1) {
                world.setSquare([row, COL], -1)
                agent.setScream(true)

            }
        }
        agent.setScream(false)
    }

    else if (agent.equals(agent.getDirection(), knowledgeBase.EAST)) {

        for (let row = ROW; row >= 0; row--) {
            if (world.world()[row][COL] == 1) {
                world.setSquare([row, COL], -1)
                agent.setScream(true)
            }
        }
        agent.setScream(false)
    }
}

function agentGrabsGold() {
    if (world.world()[agent.getPosition()[0]][agent.getPosition()[1]] == 3) {
        world.world()[agent.getPosition()[0]][agent.getPosition()[1]] = -3;
        console.log('Agent won');
        score += 1000;
    }
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
    createGame,
    turnAgent,
    moveAgent,
    processShot,
    agentGrabsGold,
    validSquares,
    setGame,
    world: () => world,
    score: () => score,
    size: () => size,
}