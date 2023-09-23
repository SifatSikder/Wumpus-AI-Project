//1==> wumpus
//2==> pit
//3==> gold
//4==> agent

var numberOfWumpus;
var startingPosition = [];
var world;

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

function isSquareEmpty(i, j) {
    return world[i][j] == 0
}

function generateWorld(size, wumpusProbablity, pitProbablity) {
    // numberOfWumpus = 0;

    // world = initializeBoard(size)
    // setStartLocation()
    // placeGold()
    // populateWorld(wumpusProbablity, pitProbablity);
    // printWorld(size)

    world = [[4, 0, 2, 0], [0, 0, 0, 0], [1, 3, 2, 0], [0, 0, 0, 2]]
    startingPosition = [0, 0]
    numberOfWumpus = 1
    printWorld(size)

}

function setStartLocation() {
    startingPosition = [0, 0]
    world[startingPosition[0]][startingPosition[1]] = 4;
}

function randomEmptyLocation() {
    while (true) {
        let x = Math.trunc(Math.random() * world.length)
        let y = Math.trunc(Math.random() * world.length)
        if (world[x][y] == 0) return [x, y]
    }
}

function placeGold() {
    let position;
    while (true) {
        position = randomEmptyLocation()
        if (position[0] != startingPosition[0] && position[1] != startingPosition[1])
            break;
    }
    let goldPosition = position
    world[goldPosition[0]][goldPosition[1]] = 3
}

function populateWorld(wumpusProbablity, pitProbablity) {

    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[0].length; j++) {

            if (isSquareEmpty(i, j)) {
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

function printWorld(size) {
    chars = { '0': ' ', '1': 'W', '2': 'P', '3': 'G', '4': 'A' }
    for (let i = 0; i < size; i++) {
        process.stdout.write(i + ' ')
        for (let j = 0; j < size; j++) {
            var ch = chars[world[i][j]]
            process.stdout.write(`| ${ch} |` + ' ')
        }
        console.log('\n' + '-------------------------------------------------------------')
    }
    console.log('=============================================================');
}



module.exports = {
    generateWorld,
    numberOfWumpus: () => numberOfWumpus,
    startingPosition: () => startingPosition,
    world: () => world,
    setSquare: (position, value) => world[position[0]][position[1]] = value
}


// generateWorld(4, 0.1, 0.1)


// generateWorld(4, 0.1, 0.1)


// console.log(world);
// console.log();

