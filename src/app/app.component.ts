import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;

  @HostListener('document:keydown', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    if (event.code == 'ArrowRight' && this.direction !== 'left') {
      this.direction = 'right';
    }
    if (event.code == 'ArrowUp' && this.direction !== 'down') {
      this.direction = 'up';
    }

    if (event.code == 'ArrowLeft' && this.direction !== 'right') {
      this.direction = 'left';
    }

    if (event.code == 'ArrowDown' && this.direction !== 'up') {
      this.direction = 'down';
    }
  }

  private SIZE = 16

  private context: CanvasRenderingContext2D;
  private snake = [];

  private food = {
    x: Math.floor(Math.random() * this.SIZE + 1) * this.SIZE,
    y: Math.floor(Math.random() * this.SIZE + 1) * this.SIZE,
  };
  private direction: 'right' | 'left' | 'down' | 'up' = 'right';

  public score: number = 0
  public record: number = 0
  constructor() {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.snake.push({ x: this.SIZE, y: this.SIZE });

    setInterval(() => {
      this.start();
    }, 100);
  }

  drawStage() {
    this.context.fillStyle = '#424632';
    this.context.fillRect(0, 0, 512,512);
  }

  drawSnake() {
    for (let i = 0; i < this.snake.length; i++) {
      this.context.fillStyle = '#ABB067';
      this.context.fillRect(this.snake[i].x, this.snake[i].y, this.SIZE, this.SIZE);

    }
    this.score = 5 * this.snake.length
    if (this.score > this.record){
      this.record = this.score
      this.saveRecord()
    }
    this.getBestScore()
  }

  saveRecord(){
    localStorage.setItem('record', this.record.toString())
  }

  getBestScore(){
    const record = Number.parseInt(localStorage.getItem('record').toString())
    if (record > this.record){
      this.record = record
    }
  }

  drawFood() {
    this.context.fillStyle = '#5C7235';
    this.context.fillRect(this.food.x, this.food.y, this.SIZE/2, this.SIZE/2);
  }

  start() {
    if (this.snake[0].x > this.SIZE * this.SIZE && this.direction == 'right')
      this.snake[0].x = 0;
    if (this.snake[0].x < 0 && this.direction == 'left')
      this.snake[0].x = this.SIZE * this.SIZE;
    if (this.snake[0].y > this.SIZE * this.SIZE && this.direction == 'down')
      this.snake[0].y = 0;
    if (this.snake[0].y < 0 && this.direction == 'up')
      this.snake[0].y = this.SIZE * this.SIZE;

    for (let i = 1; i < this.snake.length; i++) {
      if (
        this.snake[0].x == this.snake[i].x &&
        this.snake[0].y == this.snake[i].y
      ) {
        clearInterval();
        this.snake.splice(1, this.snake.length)
      }
    }

    this.drawStage();
    this.drawSnake();
    this.drawFood();

    let snakeX = this.snake[0].x;
    let snakeY = this.snake[0].y;

    if (this.direction == 'right') snakeX += this.SIZE;
    if (this.direction == 'left') snakeX -= this.SIZE;
    if (this.direction == 'up') snakeY -= this.SIZE;
    if (this.direction == 'down') snakeY += this.SIZE;

    if (snakeX != this.food.x || snakeY != this.food.y) {
      this.snake.pop();
    } else {
      this.food.x = Math.floor(Math.random() * this.SIZE + 1) * this.SIZE;
      this.food.y = Math.floor(Math.random() * this.SIZE + 1) * this.SIZE;
    }

    const newHead = {
      x: snakeX,
      y: snakeY,
    };

    this.snake.unshift(newHead);
  }
}
