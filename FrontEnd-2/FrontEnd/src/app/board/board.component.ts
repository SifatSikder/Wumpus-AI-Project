import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  grid: any[][] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.generateBoard();
  }
  BASE_URL = 'http://localhost:8080';
  generateBoard(): void {

    this.http.get<any>(`${this.BASE_URL}/generate`).subscribe(board => {
      for (let i = 0; i < board.length; i++) {
        this.grid[i] = [];
        for (let j = 0; j < board[0].length; j++) {
          if (board[i][j] == 0) {
            this.grid[i][j] = ' '
          }
          else if (board[i][j] == 1) {
            this.grid[i][j] = 'W'
          }
          else if (board[i][j] == 2) {
            this.grid[i][j] = 'P'
          }
          else if (board[i][j] == 3) {
            this.grid[i][j] = 'G'
          }
          else if (board[i][j] == 4) {
            this.grid[i][j] = 'A'
          }
        }
      }
      console.log(this.grid);
    });
  }
}
