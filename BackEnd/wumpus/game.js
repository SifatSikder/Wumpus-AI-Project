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

function moveAgent() {
    let oldPosition = agent.getPosition()
    //check if the attempted move will actually be a bump
    let x = oldPosition[0] + agent.getDirection()[0]
    let y = oldPosition[1] + agent.getDirection()[1]

    if (world.world()[x][y] == 1 || world.world()[x][y] == 2) {
        score -= 1000;
        agent.setDied(true)
        console.log('agent died.gameover+system should exit');
    }
    agent.setPosition([x, y])

    let stench = false;
    validSquares([x, y]).forEach(position => {
        if (world.world()[position[0]][position[1]] == 1) {
            stench = true
        }
    })
    agent.setStench(stench);


    let breeze = false;
    validSquares([x, y]).forEach(position => {
        if (world.world()[position[0]][position[1]] == 2) {
            breeze = true
        }
    })
    agent.setBreeze(breeze);


    if (world.world()[x][y] == 3)
        agent.setGlitter(true)

    else
        agent.setGlitter(false)

    score--;
    return true;
}

function turnAgent(direction) {
    if (direction == agent.left()) {
        console.log("Agent turned left.");
        if (agent.equals(agent.getDirection(), knowledgeBase.NORTH))
            agent.setDirection(knowledgeBase.WEST);
        else if (agent.equals(agent.getDirection(), knowledgeBase.EAST))
            agent.setDirection(knowledgeBase.NORTH);
        else if (agent.equals(agent.getDirection(), knowledgeBase.SOUTH))
            agent.setDirection(knowledgeBase.EAST);
        else if (agent.equals(agent.getDirection(), knowledgeBase.WEST))
            agent.setDirection(knowledgeBase.SOUTH);
    }



    if (direction == agent.right()) {
        console.log("Agent turned right.");
        if (agent.equals(agent.getDirection(), knowledgeBase.NORTH))
            agent.setDirection(knowledgeBase.EAST);
        else if (agent.equals(agent.getDirection(), knowledgeBase.EAST))
            agent.setDirection(knowledgeBase.SOUTH);
        else if (agent.equals(agent.getDirection(), knowledgeBase.SOUTH))
            agent.setDirection(knowledgeBase.WEST);
        else if (agent.equals(agent.getDirection(), knowledgeBase.WEST))
            agent.setDirection(knowledgeBase.NORTH);
    }
    score--;
}

function processShot() {
    if (agent.equals(agent.getDirection(), knowledgeBase.NORTH)) {
        //fire north. (0, 0) is in the bottom left corner
        for (let i = agent.getPosition()[1]; i < world.world().length; i++) {
            if (world.world()[agent.getPosition()[0]][i] == 1) {
                world.setSquare([agent.getPosition()[0], i], 0)
                agent.setScream(true)
                return;
            }
        }
    }

    //sometodo
}

function agentGrabsGold() {
    if (world.world()[agent.getPosition()[0]][agent.getPosition()[1]] == 3) {
        world.world()[agent.getPosition()[0]][agent.getPosition()[1]] = 0;
        console.log('agent died.gameover+system should exit');
        score += 1000;
    }
}

module.exports = {
    createGame,
    turnAgent,
    moveAgent,
    processShot,
    agentGrabsGold,
    score: () => score,
    size: () => size,
    // size,

}