import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) { }
  selectedCsvFile: File | null = null;


  title = 'WUMPUS---AI';
  actualBoard: any[][] = [];
  agentViewBoard: any[][] = [];
  BASE_URL = 'http://localhost:8080';
  gameStarted: boolean = false;
  boardGenerated: boolean = false;
  previousDirection: any
  currentDirection: any;
  currentPosition: any;
  currentMoves: any;
  pathMap: any;
  pitMap: any;
  wumpusMap: any;
  moves: any;
  gliterPosition: any;
  stench: any;
  breeze: any;
  died: any;
  scream: any;
  glitter: any;
  haveGold: any;
  remainingArrows: any;
  directionString: String = 'NORTH';


  async updateAgentsViewBoard(response: any): Promise<void> {

    this.currentDirection = response.currentDirection;
    this.currentPosition = response.currentPosition;
    this.currentMoves = response.currentMoves
    this.pathMap = response.pathMap;
    this.pitMap = response.pitMap;
    this.wumpusMap = response.wumpusMap;
    this.moves = response.moves;
    this.gliterPosition = response.gliterPosition;
    this.stench = response.stench
    this.breeze = response.breeze
    this.died = response.died
    this.scream = response.scream
    this.glitter = response.glitter
    this.haveGold = response.haveGold
    this.remainingArrows = response.remainingArrows
    const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));

    console.log(this.currentMoves);

    if (this.currentMoves != undefined && this.currentMoves.length > 1) {
      for (let i = 0; i < this.currentMoves.length; i++) {
        let x = this.currentMoves[i][0];
        let y = this.currentMoves[i][1];
        await sleep(200);
        this.agentViewBoard[x][y] += ' A'
        this.actualBoard[this.previousDirection[0]][this.previousDirection[1]] = ''
        this.actualBoard[x][y] = 'A'
        this.previousDirection = [x, y]
      }
    }





    let x = this.currentPosition[0]
    let y = this.currentPosition[1]
    for (let i = 0; i < this.pathMap.length; i++) {
      this.agentViewBoard[i] = [];
      for (let j = 0; j < this.pathMap[0].length; j++) {
        if (this.pitMap[i][j] == -1 && this.wumpusMap[i][j] == -1) {
          this.agentViewBoard[i][j] = 'OK'
        }
        else if (this.pitMap[i][j] >= 1 && this.wumpusMap[i][j] >= 1) {
          this.agentViewBoard[i][j] = '?P ?W'
        }
        else if (this.pitMap[i][j] >= 1 && this.wumpusMap[i][j] <= 0) {
          this.agentViewBoard[i][j] = '?P'
        }
        else if (this.wumpusMap[i][j] >= 1 && this.pitMap[i][j] <= 0) {
          this.agentViewBoard[i][j] = '?W'
        }
        else this.agentViewBoard[i][j] = '?'
        if (i == x && j == y) {
          this.agentViewBoard[x][y] += ' A'

          this.actualBoard[this.previousDirection[0]][this.previousDirection[1]] = ''
          this.actualBoard[x][y] = 'A'
          this.previousDirection = [x, y]
        }
        if (response.board[i][j] == -1) {
          this.actualBoard[i][j] = 'DW'
        }
      }
    }
    if (response.breeze) {
      this.agentViewBoard[x][y] += ' B'
    }
    if (response.stench) {
      this.agentViewBoard[x][y] += ' S'
    }
    if (response.glitter) {
      this.agentViewBoard[x][y] += ' G'
    }
    if (response.scream) {
      this.agentViewBoard[x][y] += ' Sc'
    }
  }

  updateActualBoard(board: any): void {
    for (let i = 0; i < board.length; i++) {
      this.actualBoard[i] = [];
      this.agentViewBoard[i] = [];
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] == 0) {
          this.actualBoard[i][j] = ' '
        }
        else if (board[i][j] == 1) {
          this.actualBoard[i][j] = 'W'
        }
        else if (board[i][j] == 2) {
          this.actualBoard[i][j] = 'P'
        }
        else if (board[i][j] == 3) {
          this.actualBoard[i][j] = 'G'
        }
        else if (board[i][j] == 4) {
          this.actualBoard[i][j] = 'A'
          this.agentViewBoard[i][j] = 'A'
          this.previousDirection = [i, j]
        }
      }
    }
    console.log('This is the actual generated board.');
    console.log(this.actualBoard);
  }

  generateBoard(): void {

    //get request for generating actual board
    //return value will be a 2D board containing the agent,pit,wumpus and gold
    this.http.get<any>(`${this.BASE_URL}/generate`).subscribe(board => {
      this.updateActualBoard(board)
    });
    this.boardGenerated = true;

    //get request for getting the agent's view Data
    //return value will be a json containing
    // {
    //     pathMap:  a knowledge base table about the all the paths that has been discovered
    //     wumpusMap: a knowledge base table about wumpus
    //     pitMap: a knowledge base table about pits 
    //     moves: all moves the agent has taken till now
    //     turns: all turns(left/right) the agent has taken till now
    //     gliterPosition: position of square where there is a gold
    //     currentPosition: current positioin of the agent
    //     currentDirection: current direction of the agent
    // }
    this.http.get<any>(`${this.BASE_URL}/agentViewBoard`).subscribe(response => {
      console.log('This is the agent\'s view board.');
      console.log(response);

      this.updateAgentsViewBoard(response);
      console.log(this.agentViewBoard);
    });
  }

  play() {
    this.http.get<any>(`${this.BASE_URL}/play`).subscribe(response => {
      console.log(response.currentMoves);

      this.updateAgentsViewBoard(response);
      this.directionString = this.getDirection();
      if (response.died) alert('Agent Died')
      if (response.haveGold) alert('Agent won')

      console.log('This is the agent\'s view board.');
      console.log(this.agentViewBoard);
    });
  }



  async autoplay() {
    const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
    let died = false;
    let haveGold = false;
    while (true) {
      await sleep(1000);

      this.http.get<any>(`${this.BASE_URL}/play`).subscribe(response => {
        console.log(response.currentMoves);

        this.updateAgentsViewBoard(response);
        this.directionString = this.getDirection();
        if (response.died) {
          died = true;
        }
        if (response.haveGold) {
          haveGold = true;
        }

        console.log('This is the agent\'s view board.');
        console.log(this.agentViewBoard);
      });
      if (died || haveGold) break
    }
    if (died) {
      let x = this.currentPosition[0] + this.currentDirection[0]
      let y = this.currentPosition[1] + this.currentDirection[1]
      this.actualBoard[x][y] += ' A'
      await sleep(200)
      alert('Agent Died')
    }
    if (haveGold) {
      let x = this.currentPosition[0]
      let y = this.currentPosition[1]
      this.actualBoard[x][y] += ' A'
      await sleep(200)
      alert('Agent Won!!!')
    }
  }

  getDirection(): String {

    if (this.currentDirection[0] == 0 && this.currentDirection[1] == 1) return 'NORTH'
    else if (this.currentDirection[0] == 0 && this.currentDirection[1] == -1) return 'SOUTH'
    else if (this.currentDirection[0] == -1 && this.currentDirection[1] == 0) return 'WEST'
    else return 'EAST'
  }

  onFileSelected(event: any) {
    this.selectedCsvFile = event.target.files[0];
  }

  uploadFromCsv() {
    if (!this.selectedCsvFile) {
      console.error("No file selected");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {

      const csvData: string = e.target.result;
      const rows: string[] = csvData.split('\r\n');

      for (const row of rows) {
        const rowData: string[] = row.split(',');
        const boardRow: number[] = [];


        for (const value of rowData) {
          if (value === 'P')
            boardRow.push(2); // Pit
          else if (value === 'W')
            boardRow.push(1); // Wumpus
          else if (value === 'G')
            boardRow.push(3); // Gold
          else if (value === '-')
            boardRow.push(0); // Empty
          else if (value === 'A')
            boardRow.push(4); // Agent
        }
        if (boardRow.length > 0) this.actualBoard.push(boardRow);
      }
      console.log('Parsed Wumpus Board:', this.actualBoard);
      this.sendBoardtoServer(this.actualBoard);

    };
    reader.readAsText(this.selectedCsvFile);
  }

  sendBoardtoServer(board: any) {
    this.http.post<any>(`${this.BASE_URL}/setboard`, { board }).subscribe(response => {
      this.updateActualBoard(response)
      this.boardGenerated = true;

      this.http.get<any>(`${this.BASE_URL}/agentViewBoard`).subscribe(response => {
        this.updateAgentsViewBoard(response);
        console.log('This is the agent\'s view board.');
        console.log(this.agentViewBoard);
      });
    });



  }
}
