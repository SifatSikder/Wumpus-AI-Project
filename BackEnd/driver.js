// var world = require('./wumpus/world')

// world.generateWorld(4, 0.1, 0.1);

// console.log(world.world());



const agent = require('./wumpus/agent')
const game = require('./wumpus/game')
game.createGame(4, 0.1, 0.1, agent)


agent.start(game)





