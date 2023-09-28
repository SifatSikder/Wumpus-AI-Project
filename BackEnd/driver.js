// var world = require('./wumpus/world')

// world.generateWorld(4, 0.1, 0.1);

// console.log(world.world());



const agent = require('./wumpus/agent')
const game = require('./wumpus/game')
// for (let i = 0; i < 10; i++) {
game.createGame(10, 0.2, 0.2, agent)
agent.start(game)







