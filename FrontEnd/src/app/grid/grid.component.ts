import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  
  grid: any[][] = [];
  isGameStarted: boolean = false;
  gameStarted = false;


  constructor() { }

  ngOnInit(): void {
    this.generateGrid();
  }

  generateGrid(): void {
    const numRows = 10;
    const numCols = 10;

    for (let i = 0; i < numRows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < numCols; j++) {
        this.grid[i][j] = { imageType: 'Blank',isHidden: false };
      }
    }

    this.placeRandomImages('Type1', 2);
    this.placeRandomImages('Type2', 3);
  }

  placeRandomImages(imageType: string, numImages: number): void {
    const numRows = this.grid.length;
    const numCols = this.grid[0].length;

    while (numImages > 0) {
      const randomRow = Math.floor(Math.random() * numRows);
      const randomCol = Math.floor(Math.random() * numCols);

      if (this.grid[randomRow][randomCol].imageType === 'Blank') {
        this.grid[randomRow][randomCol].imageType = imageType;
        numImages--;
      }
    }
  }

  startGame(): void {
    this.isGameStarted = true;
    this.gameStarted = true;
    // Hide all grids except the grid at 9th row and 0th column
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j].isHidden = !(i === 9 && j === 0);
      }
    }
  }

  revealCell(row: number, col: number): void {
    if (this.isGameStarted && this.grid[row][col].isHidden) {
      this.grid[row][col].isHidden = false;
    }
  }

}
