const agent = require('./wumpus/agent')
const game = require('./wumpus/game')
game.createGame(10, 0.2, 0.2, agent)
agent.start(game)


while (true) {
    agent.play();
}





