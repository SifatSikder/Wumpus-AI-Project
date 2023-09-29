const express = require('express')
const app = express()

//cors setup
const cors = require("cors");
app.use(cors())

//body parser configutation
const bodyParser = require('body-parser');
app.use(bodyParser.json());


//PORT and SERVER starting configuration
const PORT = 8080
app.listen(PORT, () => { console.log(`Server is running at port ${PORT}`) })


//required files fetching
const agent = require('./wumpus/agent')
const game = require('./wumpus/game')


app.get('/generate', (req, res) => {
    res.status(200).json(game.createGame(10, 0.2, 0.2, agent));
})

// app.get('/flush', (req, res) => {
//   var board = gomuko.flushBoard()
//   res.status(200).json({ message: 'Board Flushed', board: board });
// })
