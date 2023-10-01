const express = require('express')
const app = express()

//cors setup
const cors = require("cors");
app.use(cors())

//body parser configutation
const bodyParser = require('body-parser');
const { wumpusMap } = require('./wumpus/knowledgeBase');
app.use(bodyParser.json());


//PORT and SERVER starting configuration
const PORT = 8080
app.listen(PORT, () => { console.log(`Server is running at port ${PORT}`) })


//required files fetching
var agent, game;
app.get('/generate', (req, res) => {
    agent = require('./wumpus/agent')
    game = require('./wumpus/game')
    let board = game.createGame(10, 0.2, 0.2, agent)
    agent.start(game);
    res.status(200).json(board);
})
app.post('/setboard', (req, res) => {
    agent = require('./wumpus/agent')
    game = require('./wumpus/game')
    let { board } = req.body
    board = game.setGame(board, agent)
    agent.start(game);
    res.status(200).json(board);
})

app.get('/agentViewBoard', (req, res) => {
    res.status(200).json(agent.sendInfo());
})

app.get('/play', (req, res) => {
    agent.play()
    res.status(200).json(agent.sendInfo());
})




