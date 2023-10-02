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
game.turnAgent(direction)
kb.registerTurn(direction)
shoot()
Use an arrow to shoot. Numarrows- - ;
game.processShot()
process the current percept⇒ processPercepts(current position⇒x,y)
pickGold():
game.grabGold()
play()
if(kb.askglitter()): pickGold() return;
State the riskFactor=-2
There are 3 possible moves and hence three possible score to calculate: forward,left,right
If direction=kb.north ask the kb if there is any possibility to have any wumpus,pit,obstacle in the next column(forward score),previous/after row(left/right score) 
Do the step in ‘d’ for other 3 direction
If the forward score is less than the risk factor,left and right score then make the move, print the board, and return
Else If the left score is less than the risk factor and right score then turn left, make the move, print the board, and return
Else If the right score is less than the risk factor then turn right, make the move, print the board, and return
Else we need to backtrack⇒ 2 possibilities⇒ backtracked or not(in this case increase the risk factor)

Game Class:
Properties: world (2d int),agent, size,score
Constructor: int size, Agent agent, double wumpusProb, double pitProb, double obsProb
Generate the world from the world.generate function by providing the size and the 3 probabilities
Initialize the agent and the agent’s starting point(agent.position= world.starting_position)
Initialize the size and the score=1000
getscore(): return score
Boolean moveAgent(): 
Take the old position from agent.postion
Check if there is any obstacle or not by checking a particular square value==3 where the index is the agent's current position+current direction. If yes then return false
Else Check if there is any wumpus or pit or not by checking a particular square value==1 or 2 where the index is the agent's current position+current direction. If yes then deduct score by 1000,agent.died and gameover is true, and exit the system.
Else update the new position by doing position = position+direction (execute the move)
Now send the new percepts to the agent:
Check the neighboring 4 squares in the world and if any square has a wumpus/breeze (value = 1/2) then agent.stench/breeze=true else false
If there is a glitter in the current position then agent.glitter=true or false
Deduct a score by 1
Return true
turnAgent(direction):
If direction ==left:
If the current direction of the agent (agent.direction) equals to kb.north/south/east/west then we will set the direction (agent.direction= kb.west/east/north/south)
If direction ==right:
If the current direction of the agent (agent.direction) equals to kb.north/south/east/west then we will set the direction (agent.direction= kb.east/west/south/north)
Deduct a score by 1






processShot():
if the current direction=north then perform a loop in a row forward way until the last square. 
If any of the square contains a wumpus(world[][]=1) then
Kill the wumpus(set world[][]=0)
Agent will heard the scream (agent.screamHeard=true) and return
Else if it hits any obstacle (world[][]=3 ) then make agent.screamHeard=false and break the loop

agentGrabsgold(): 
If the square in the world at index= agent.current position is 4(glittering) then set the square value 0(gold picked), game over =true and score +=1000 and win=true
 KnowledgeBase Class:

Constants: east/west/north/south ⇒ 1d array , clear=-1 , direction= north,east,west,south
Properties: move stack,turn stack, path map,wumpus map,pit map,obstacle map,glitter position
Constructor(): initialize all the map (map[size][size]) and all map entry as 0 and the glitter and the move and turn stacks
perceive(position,map): for each direction if the square is valid then increase square value in the map by 1
registerMove(position):
Add the move in move stack
As the move has happened so the agent is sure that the square is clear. So update the square of wumpus,pit and obstacle map= clear and increase the square value of the pathMap by 1
registerTurn(int direction):
If direction=0/1(left/right) then add the direction in the turnstack 
tellClear(position):
For each direction Find all the neighboring squares.
If a square within the range(0.. <length) then mark that square in the wumpus and pit map as clear
Int askPath/pit/wumpus(position): return the value of the square of path/pit/wumpus map at index(pos-x,pos-y)
tellStench/breeze(position): if the square at the mentioned position is unvisited or visited only 1 time (pathMap[pos-x][pos-y]<=1) then perceive this position with the wumpus/pit map
tellBump(position,direction): increase the value of the square of the obstacleMap at index [pos+dir-x][pos+dir-x] by 1
tellGlitter(position): set the glitter=position
Int askObstacle(position): if the square at the mentioned position of obstacle Map is > 0 (obstacle present) then return a high score (100)
Boolean askGlitter(position): return glitter==position 
tellscream(position,direction): if obstacleMap[position]>0 then clear the wumpus and return else clear the wumpus and update the position=position+direction until the position(both x and y) is <wumpusMap.length
World Class:
Properties: Number of wumpus, starting position. Both should be constant
Constant 2d board generateWorld(size, wumpusProbablity,pitProbablity, obstacleProbablity):
Create a 2d board[size+2][size+2]
numWumpus=0
Populate the world
Place gold in the world
Set Start Location in the world
Return the board
setStartLocation(board):
Set  startingPosition=[0,0] or randomEmptyLocation(board)
randomEmptyLocation(board):
Perform a infinite loop 
Generate 2(x,y) random value(between 0-1) and multiply it by board length and convert it in integer
If board[x][y]=0 then return [x,y]
placeGold(board):
Set  goldPosition=randomEmptyLocation(board)
board [ goldPosition[0]  ] [ goldPosition[1]  ] = 4
populateWorld(board,wumpusProbablity,pitProbablity, obstacleProbablity):
Go to each cell in the board and if
i=0 or j=0 or i=length-1 or j= length -1 then board[x][y]=3 and continue;
Generate a random value and if random value <= wumpusProbablity then board[x][y]=1 and increase the number of wumpus and continue 
Generate a random value and if random value <= pitProbablity then board[x][y]=2 and continue 
Generate a random value and if random value <= obstacleProbablity then board[x][y]=3 and continue 


