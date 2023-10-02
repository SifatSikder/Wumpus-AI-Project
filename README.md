# Wumpus-AI-Project
# Initial Design Document  
**Driver Class:**

1. Create an agent
2. Create the game with size, the reasoning agent just created, and the probability of wumpus, pit and obstacle
3. Run the created agent.start(created game) function which will return the game status boolean variable. If true ⇒ agent won else lost

**Agent Class:**

1. Constant: left=0 ,right =1
2. Properties:
    1. Position and direction: 1D array
    2. Breeze,stench,scream,died,glitter, havegold,bump (optional for obstacle) ⇒ boolean
    3. Number of arrows: int
    4. A game object to play and a kb to build the knowledge to play the game
    5. Constructor⇒ number of arrow will be assigned from the world.Number of wumpus
3. Methods:  
    1. start(game):
        1. Initialize the game variable of agent class (game=game)
        2. Create a new knowledge base with the game size
        3. Set the default direction in north
        4. Register the move in the knowledge base. kb.registermove(current position⇒x,y)
        5. Play the game in a while true loop, while(true) play();
    2. move():
        1.  Check the result of the game.moveAgent().
        2.  If false, means a bump, run kb.tellbump(pos-x,pos-y,direction) and then return
        3.  Else register the move in the kb⇒ kb.registermove(current position⇒x,y)
        4.  After moving, process the current percept⇒ processPercepts(current position⇒x,y)
    3. processPercepts(position⇒x,y)
        1. if(glitter): kb.tellglitter(position⇒x,y)
        2. Else if(breeze): kb.tellbreeze(position⇒x,y)
        3. Else if(stench): kb.tellstench(position⇒x,y)
        4. Else kb.tellclear(position⇒x,y)
    4. turn(direction)
        1. game.turnAgent(direction)
        2. kb.registerTurn(direction)
    5.shoot()
        1. Use an arrow to shoot. Numarrows- - ;
        2. game.processShot()
        3. process the current percept⇒ processPercepts(current position⇒x,y)
    6. pickGold():
        1. game.grabGold()
    7. play()
        1. if(kb.askglitter()): pickGold() return;
        2. State the riskFactor=-2
        3. There are 3 possible moves and hence three possible score to calculate: forward,left,right
            1. If direction=kb.north ask the kb if there is any possibility to have any wumpus,pit,obstacle in the next column(forward score),previous/after row(left/right score) 
            2. Do the previous step for other 3 direction
        4.Make a move based on the score
            1. If the forward score is less than the risk factor,left and right score then make the move, print the board, and return
            2. Else If the left score is less than the risk factor and right score then turn left, make the move, print the board, and return
            3. Else If the right score is less than the risk factor then turn right, make the move, print the board, and return
            4. Else we need to backtrack⇒ 2 possibilities⇒ backtracked or not(in this case increase the risk factor)

**Game Class:**
1. Properties: world (2d int),agent, size,score
2. Constructor: int size, Agent agent, double wumpusProb, double pitProb, double obsProb
    1. Generate the world from the world.generate function by providing the size and the 3 probabilities
    2. Initialize the agent and the agent’s starting point(agent.position= world.starting_position)
    3. Initialize the size and the score=1000

3. Boolean moveAgent(): 
    1. Take the old position from agent.postion
    2. Check if there is any obstacle or not by checking a particular square value==3 where the index is the agent's current position+current direction. If yes then return false
    3. Else Check if there is any wumpus or pit or not by checking a particular square value==1 or 2 where the index is the agent's current position+current direction. If yes then deduct score by 1000,agent.died and gameover is true, and exit the system.
    4. Else update the new position by doing position = position+direction (execute the move)
    5. Now send the new percepts to the agent:
        1. Check the neighboring 4 squares in the world and if any square has a wumpus/breeze (value = 1/2) then agent.stench/breeze=true else false
        2. If there is a glitter in the current position then agent.glitter=true or false
        3. Deduct a score by 1
        4. Return true
4. turnAgent(direction):
    1. If direction ==left:
        1. If the current direction of the agent (agent.direction) equals to kb.north/south/east/west then we will set the direction (agent.direction= kb.west/east/north/south)
    2. If direction ==right:
        1. If the current direction of the agent (agent.direction) equals to kb.north/south/east/west then we will set the direction (agent.direction= kb.east/west/south/north)
    Deduct a score by 1






5. processShot():
    1. if the current direction=north then perform a loop in a row forward way until the last square. 
    2. If any of the square contains a wumpus(world[][]=1) then
    3. Kill the wumpus(set world[][]=0)
    4. Agent will heard the scream (agent.screamHeard=true) and return
    5. Else if it hits any obstacle (world[][]=3 ) then make agent.screamHeard=false and break the loop

6. agentGrabsgold(): 
    1. If the square in the world at index= agent.current position is 4(glittering) then set the square value 0(gold picked), game over =true and score +=1000 and win=true
 
**KnowledgeBase Class:**

1. Constants: east/west/north/south ⇒ 1d array , clear=-1 , direction= north,east,west,south
2. Properties: move stack,turn stack, path map,wumpus map,pit map,obstacle map,glitter position
3. Constructor(): initialize all the map (map[size][size]) and all map entry as 0 and the glitter and the move and turn stacks
4. perceive(position,map): for each direction if the square is valid then increase square value in the map by 1
5. registerMove(position):
    1. Add the move in move stack
    2. As the move has happened so the agent is sure that the square is clear. So update the square of wumpus,pit and obstacle map= clear and increase the square value of the pathMap by 1
registerTurn(int direction):
    1. If direction=0/1(left/right) then add the direction in the turnstack 
6. tellClear(position):
    1. For each direction Find all the neighboring squares.
    2. If a square within the range(0.. <length) then mark that square in the wumpus and pit map as clear
7. Int askPath/pit/wumpus(position): return the value of the square of path/pit/wumpus map at index(pos-x,pos-y)
8. tellStench/breeze(position): if the square at the mentioned position is unvisited or visited only 1 time (pathMap[pos-x][pos-y]<=1) then perceive this position with the wumpus/pit map
9. tellBump(position,direction): increase the value of the square of the obstacleMap at index [pos+dir-x][pos+dir-x] by 1
10. tellGlitter(position): set the glitter=position
11. Int askObstacle(position): if the square at the mentioned position of obstacle Map is > 0 (obstacle present) then return a high score (100)
12. Boolean askGlitter(position): return glitter==position 
13. tellscream(position,direction): if obstacleMap[position]>0 then clear the wumpus and return else clear the wumpus and update the position=position+direction until the position(both x and y) is <wumpusMap.length
  
**World Class:**
1. Properties: Number of wumpus, starting position. Both should be constant
2. Constant 2d board generateWorld(size, wumpusProbablity,pitProbablity, obstacleProbablity):
    1. Create a 2d board[size+2][size+2]
    2. numWumpus=0
    3. Populate the world
    4. Place gold in the world
    5. Set Start Location in the world
    6. Return the board
3. setStartLocation(board):
    1. Set  startingPosition=[0,0] or randomEmptyLocation(board)
4. randomEmptyLocation(board):
    1. Perform a infinite loop 
    2. Generate 2(x,y) random value(between 0-1) and multiply it by board length and convert it in integer
    3. If board[x][y]=0 then return [x,y]
5. placeGold(board):
    1. Set  goldPosition=randomEmptyLocation(board)
    2. board [ goldPosition[0]  ] [ goldPosition[1]  ] = 4
6. populateWorld(board,wumpusProbablity,pitProbablity, obstacleProbablity):
    1. Go to each cell in the board and if
    2. i=0 or j=0 or i=length-1 or j= length -1 then board[x][y]=3 and continue;
    3. Generate a random value and if random value <= wumpusProbablity then board[x][y]=1 and increase the number of wumpus and continue 
    4. Generate a random value and if random value <= pitProbablity then board[x][y]=2 and continue 
    5. Generate a random value and if random value <= obstacleProbablity then board[x][y]=3 and continue 


