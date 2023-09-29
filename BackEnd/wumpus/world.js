//1==> wumpus
//2==> pit
//3==> gold
//4==> agent

var numberOfWumpus;
var startingPosition = [];
var world;
var size;

function initializeBoard(size) {
    var board = [];
    for (let i = 0; i < size; i++) {
        var row = [];
        for (let j = 0; j < size; j++) {
            row.push(0);
        }
        board.push(row)
    }
    return board
}

function generateWorld(SIZE, wumpusProbablity, pitProbablity) {
    size = SIZE;
    // numberOfWumpus = 0;
    // world = initializeBoard(SIZE)
    // setStartLocation()
    // placeGold()
    // populateWorld(wumpusProbablity, pitProbablity);
    // printWorld(SIZE)

    //won systems
    // world = [[4, 0, 0, 0], [0, 2, 0, 3], [0, 0, 1, 1], [0, 0, 0, 0]]
    // numberOfWumpus = 2
    // world = [[4, 0, 0, 1], [0, 0, 0, 0], [0, 1, 0, 3], [1, 0, 0, 0]]
    // numberOfWumpus = 3
    // world = [[4, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [1, 1, 3, 0]]
    // numberOfWumpus = 4
    // world = [[4, 0, 0, 0], [0, 2, 0, 3], [0, 1, 2, 0], [0, 0, 0, 0]]
    // numberOfWumpus = 1
    // world = [[4, 0, 0, 1], [0, 0, 0, 3], [0, 0, 1, 0], [0, 0, 2, 0]]
    // numberOfWumpus = 3



    //Died systems
    // world = [[4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 2, 1], [0, 0, 1, 3]]
    // numberOfWumpus = 2
    // world = [[4, 0, 1, 0], [0, 0, 0, 0], [0, 0, 2, 0], [1, 1, 0, 3]]
    // numberOfWumpus = 3
    // world = [[4, 0, 1, 0], [0, 0, 0, 0], [1, 0, 2, 3], [0, 0, 2, 0]]
    // numberOfWumpus = 2
    // world = [[4, 0, 0, 2], [0, 2, 0, 1], [1, 3, 1, 0], [0, 0, 0, 0]]
    // numberOfWumpus = 3


    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        world = [
            [4, 0, 0, 2, 1, 0, 1, 1, 0, 0],
            [0, 2, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 0, 2, 2, 0],

            [0, 1, 1, 1, 1, 0, 2, 1, 2, 0],
            [0, 0, 0, 0, 0, 2, 1, 0, 0, 0],
            [1, 0, 0, 2, 3, 2, 0, 0, 2, 0],

            [0, 1, 0, 0, 2, 1, 2, 1, 0, 0],
            [2, 0, 0, 0, 1, 0, 2, 0, 2, 0],

            [0, 2, 1, 2, 0, 0, 0, 0, 2, 0],
            [2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        ]
    numberOfWumpus = 18

    startingPosition = [0, 0]
    printWorld(SIZE)
}

function setStartLocation() {
    startingPosition = [0, 0]
    world[startingPosition[0]][startingPosition[1]] = 4;
}

function placeGold() {
    let position;
    while (true) {
        position = randomEmptyLocation()
        if (position[0] != startingPosition[0] && position[1] != startingPosition[1] && !blocked(position))
            break;
    }
    let goldPosition = position
    world[goldPosition[0]][goldPosition[1]] = 3
}

function populateWorld(wumpusProbablity, pitProbablity) {

    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[0].length; j++) {

            if (isSquareEmpty(i, j) && !blocked([i, j])) {
                if (Math.random() <= wumpusProbablity) {
                    world[i][j] = 1;
                    numberOfWumpus++;
                    continue;
                }
                if (Math.random() <= pitProbablity) {
                    world[i][j] = 2;
                    continue;
                }
            }

        }
    }


}








function isSquareEmpty(i, j) {
    return world[i][j] == 0
}

function randomEmptyLocation() {
    while (true) {
        let x = Math.trunc(Math.random() * world.length)
        let y = Math.trunc(Math.random() * world.length)
        if (world[x][y] == 0) return [x, y]
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

function blocked(position) {
    let blockedSquares = validSquares(startingPosition)
    for (let i = 0; i < blockedSquares.length; i++) {
        if (blockedSquares[i][0] == position[0] && blockedSquares[i][1] == position[1]) {
            return true
        }
    }
    return false
}

function writeToFile(content) {
    const fs = require('fs');
    fs.appendFileSync('./result.txt', content, err => {
        if (err) console.error(err);
    });
}

function printWorld(size) {
    chars = { '0': ' ', '1': 'W', '2': 'P', '3': 'G', '4': 'A' }
    for (let i = 0; i < size; i++) {
        process.stdout.write(i + ' ')
        writeToFile(i + ' ')
        for (let j = 0; j < size; j++) {
            var ch = chars[world[i][j]]
            process.stdout.write(`| ${ch} |` + ' ')
            writeToFile(`| ${ch}${world[i][j]} |` + ' ')
        }
        console.log('\n' + '-------------------------------------------------------------')
        writeToFile('\n')
        writeToFile('---------------------------------------------------------------------------------')
        writeToFile('\n')
    }
    console.log('=============================================================================');
    writeToFile('=============================================================================')
    writeToFile('\n')
}

module.exports = {
    generateWorld,
    printWorld,
    numberOfWumpus: () => numberOfWumpus,
    startingPosition: () => startingPosition,
    world: () => world,
    setSquare: (position, value) => world[position[0]][position[1]] = value
}


// generateWorld(4, 0.1, 0.1)


// generateWorld(4, 0.1, 0.1)


// console.log(world);
// console.log();

