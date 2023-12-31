// {"name": "Air Hockey Challenger", "author": "Alex Dev", "version": "04012023", "icon": "app_icon.png", "file": "main.js"}
var font = new Font("fonts/LEMONMILK-Regular.otf");
let canvas = Screen.getMode();
canvas.width = 640;
canvas.height = 448;
Screen.setMode(canvas);

Sound.setVolume(100);
Sound.setVolume(100,0);

let sounds={
  ball_audio: Sound.load("assets/sound/snd13.ogg")
};

  
const colors = {
  Black: Color.new(0, 0, 0),
  White: Color.new(255, 255, 255),
  BlueDark: Color.new(23, 27, 255),
  Blue: Color.new(48, 92, 255)
};
const MenuImage = {
  menu: new Image("assets/mainmenu/mainmenu.png"),
  menu_pause: new Image("assets/mainmenu/menu_pause.png"),
  menu_opçoes: new Image("assets/mainmenu/menu_opcões.png"),
  hand_difficulty: new Image("assets/mainmenu/difficulty.png"),
  seta: new Image("assets/mainmenu/Check.png")
};
var Players = {
  Player1: [{ X: 569, Y: 195, gols : 0}],
  Player2: [{ X: 13, Y: 195, gols : 0 }]
};

const GameImage = {
  bg: new Image("assets/game/arena.png"),
  ball: new Image("assets/game/ball.png"),
  red: new Image("assets/game/red_paddle.png"),
  blue: new Image("assets/game/blue_paddle.png"),
  winner: new Image("assets/game/result/result_text_youwin.png"),
  loser: new Image("assets/game/result/result_text_youlose.png")
};

const Black = Color.new(255, 255, 255);
font.color = Black;

var screen = 0;


// variaveis do jogo
var Ball = { X: 285, Y: 190,dx: 3,
  dy: 3,
  radius: 10,};
let new_pad = Pads.get();
let old_pad = new_pad;
let pd = Pads.get();
let pd2 = Pads.get();
var velocidade = 8;
var ballSpeedX = 8;
var ballSpeedY = 8;
var speed_cpu = 8;

let Nums = {
  particule: new Image("assets/effect/light_blue.png"),
  nums_red : new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png"),
  nums_blue : new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png")
}
var op_seta = 
  [{ x: 388, y: 135 },
  { x: 388, y: 187 },
  { x: 388, y: 243 },
  { x: 388, y: 295 },
  { x: 388, y: 347 }];
var seta = 
  [{ x: 388, y: 317 },
  { x: 388, y: 357 },
  { x: 388, y: 397 }];

var seta_pos = seta[0]
var seta_option_pos = op_seta[0];
var Count = 0;
var selected = 0;
var difficulty = 0;
var c = 0;

class main {
  
  SetScreen() {
    if (screen == 0) {
      this.Menu();
    }
    if (screen == 1) {
      this.Play();
    }
    if (screen == 2){
      this.menu_pause();
      
    }
    if (screen == 3){
      this.menu_opçoes();
    }
  }
  
  ResetPlayers(){
    Players.Player1[0].X = 569;
    Players.Player1[0].Y = 195;
    Players.Player2[0].X = 13;
    Players.Player2[0].Y = 195;
  }

  MoveSetaUp() {
    if (Count > 0){
    seta_pos = seta[Count -= 1];
    selected -= 1;
    }
  }
  MoveSetaDown() {
    if (Count < 4){
      seta_pos = seta[Count += 1]
      selected += 1;
  }
  }
  Check_gol() {
    if ((Ball.X <= 1) && (Ball.Y + 64 >= 160 && Ball.Y <= 287)) {
      Players.Player2[0].gols += 1;
      this.ResetBall();
      this.ResetPlayers();
      Nums.nums_red = new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png");
      Nums.nums_blue = new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png");
      
      
    }
    if ((Ball.X + 64 >= 639) && (Ball.Y + 64 >= 160 && Ball.Y <= 287)) {
      Players.Player1[0].gols += 1;
      this.ResetBall();
      this.ResetPlayers();
      Nums.nums_red = new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png");
      Nums.nums_blue = new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png");
    
  }
  }
  normalize_value(add_value){
    return ((add_value - -127) / (128 - -127) * (15 - -15) + -15);
  }
  DesacelateBall() {
    //desacelacao do vetores positivos
    if (ballSpeedX > 8) {
      ballSpeedX--;
    }
    if (ballSpeedY > 8) {
      ballSpeedY--;
    }
    // desacelaracao dos vetores negativos
    if (ballSpeedX < -8) {
      ballSpeedX++;
    }
    if (ballSpeedY < -8) {
      ballSpeedY++;
    }
  }
  adjuste_difficulty(){
    if (difficulty == 0){
      speed_cpu = 4;
    }else if (difficulty == 1){
      speed_cpu = 8;
    }else if(difficulty == 2){
      speed_cpu = 12;
    }else if(difficulty == 3){
      speed_cpu = 15;
    }
  }
  
  ResetBall(){
    ballSpeedX = 0;
    ballSpeedY = 0;
    Ball.X = 285;
    Ball.Y = 190;
  }
  Menu() {
    old_pad = new_pad;
    new_pad = Pads.get();

    if (Pads.check(new_pad, Pads.UP) && !Pads.check(old_pad, Pads.UP)) {
      this.MoveSetaUp();
    }
    if (Pads.check(new_pad, Pads.DOWN) && !Pads.check(old_pad, Pads.DOWN)) {
      this.MoveSetaDown();
    }

    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS) && selected == 0) {
      screen = 1;
      this.ResetBall();
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS) && selected == 1) {
      screen = 1;
      this.ResetBall();
      this.adjuste_difficulty();
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS) && selected == 2) {
      screen = 3;
      
    }
    Sound.play(sounds.thema);
    MenuImage.menu.draw(0, 0);
    MenuImage.seta.draw(seta_pos.x, seta_pos.y);
  }

  menu_pause(){
    old_pad = new_pad;
    new_pad = Pads.get();
    MenuImage.menu_pause.draw(0,0);
    MenuImage.seta.draw(seta_pos.x,seta_pos.y);
    if (Pads.check(new_pad, Pads.UP) && !Pads.check(old_pad, Pads.UP)) {
      this.MoveSetaUp();
    }
    if (Pads.check(new_pad, Pads.DOWN) && !Pads.check(old_pad, Pads.DOWN)) {
      this.MoveSetaDown();
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS) && selected == 0) {
      screen = 1;
      this.ResetBall();
      this.ResetPlayers();
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS) && selected == 1) {
      screen = 1;
      this.ResetBall();
      this.ResetPlayers();
      Players.Player1[0].gols = 0;
      Players.Player2[0].gols = 0;
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS) && selected == 2) {
      screen = 0;
      
    }
  }

  menu_opçoes(){
    old_pad = new_pad;
    new_pad = Pads.get();
    if (Pads.check(new_pad, Pads.UP) && !Pads.check(old_pad, Pads.UP)) {
      if (c > 0){
        seta_option_pos = op_seta[c -= 1];
      }
    }
    if (Pads.check(new_pad, Pads.DOWN) && !Pads.check(old_pad, Pads.DOWN)) {
      if (c < 4){
        seta_option_pos = op_seta[c += 1];
      }
      
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)) {
      if (c >= 0 && c <= 3){
        difficulty = c;
      }
      if (c == 4){
        screen = 0;
      }
    }
    MenuImage.menu_opçoes.draw(0,0);
    MenuImage.hand_difficulty.draw(423, op_seta[difficulty].y);
    MenuImage.seta.draw(seta_option_pos.x, seta_option_pos.y);
  }

  Move_paddles() {
    pd = Pads.get();
    if (pd.rx < -30) {
      Players.Player1[0].X = Players.Player1[0].X - velocidade;
    }
    if (pd.rx > 30) {
      Players.Player1[0].X = Players.Player1[0].X + velocidade;
    }
    if (pd.ry > 30) {
      Players.Player1[0].Y = Players.Player1[0].Y + velocidade;
    }
    if (pd.ry < -30) {
      Players.Player1[0].Y = Players.Player1[0].Y - velocidade;
    }
    // move paddle 1
    pd2 = Pads.get();
    if (pd2.lx < -30) {
      Players.Player2[0].X = Players.Player2[0].X - velocidade;
    }
    if (pd2.lx > 30) {
      Players.Player2[0].X = Players.Player2[0].X + velocidade;
    }
    if (pd2.ly > 30) {
      Players.Player2[0].Y = Players.Player2[0].Y + velocidade;
    }
    if (pd2.ly < -30) {
      Players.Player2[0].Y = Players.Player2[0].Y - velocidade;
    }
    
  }
  draw() {
    GameImage.bg.draw(0, 0);
    GameImage.ball.draw(Ball.X, Ball.Y);
    GameImage.red.draw(Players.Player1[0].X, Players.Player1[0].Y);
    GameImage.blue.draw(Players.Player2[0].X, Players.Player2[0].Y);
    Nums.nums_blue.draw(272,25);
    Nums.nums_red.draw(330,25);
    
  }

  start() {
    old_pad = new_pad;
    new_pad = Pads.get();

    if (Pads.check(new_pad, Pads.START) && !Pads.check(old_pad, Pads.START) && screen == 1) {
     screen = 2;
    }
  }
  WinnerPlayer(){
    old_pad = new_pad;
    new_pad = Pads.get();
    if(Players.Player1[0].gols == 10){
      GameImage.loser.draw(((640 - 373)/2), ((448 - 83)/2));
      if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)){
      screen = 0;
      }
    }else if(Players.Player2[0].gols == 10){
      GameImage.winner.draw(((640 - 402)/2), ((448 - 84)/2));
      if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)){
        screen = 0;
      }
    }
  }
  CollisionBall() {
    // Verificar colisão com as bordas da tela para a bola
    if (Ball.X + 64 >= 640 || Ball.X <= 0) {
      Sound.play(sounds.ball_audio,0);
      ballSpeedX = -ballSpeedX; // Inverter a direção no eixo X
    }
    if (Ball.Y + 64 >= 448 || Ball.Y <= 0) {
      Sound.play(sounds.ball_audio,0);
      ballSpeedY = -ballSpeedY; // Inverter a direçãeixo Yo no
    }
    //Colisão dos paddle com a parede
    if (Players.Player1[0].X < 320) {
      //meio
      Players.Player1[0].X = 320;
    }
    if (Players.Player1[0].Y > 348) {
      //baixo
      Players.Player1[0].Y = 348;
    }
    if (Players.Player1[0].Y < 0) {
      //cima
      Players.Player1[0].Y = 0;
    }
    if (Players.Player1[0].X > 540) {
      //fim direita
      Players.Player1[0].X = 540;
    }

    //player 2
    if (Players.Player2[0].X > 220) {
      //meio
      Players.Player2[0].X = 220;
    }
    if (Players.Player2[0].Y > 348) {
      //baixo
      Players.Player2[0].Y = 348;
    }
    if (Players.Player2[0].Y < 0) {
      //cima
      Players.Player2[0].Y = 0;
    }
    if (Players.Player2[0].X < 0) {
      //fim esquerda
      Players.Player2[0].X = 0;
    }
    // Verificar colisão com os jogadores (paddles)
    if (// paddle esq
    Ball.X + 64 >= Players.Player2[0].X && Ball.X <= Players.Player2[0].X + 100 && Ball.Y + 64 >= Players.Player2[0].Y && Ball.Y <= Players.Player2[0].Y + 100
    ) {
      ballSpeedY = this.normalize_value(pd.ry);
      ballSpeedX = this.normalize_value(pd.rx);
      if(pd.ry == 0){
        ballSpeedY = -ballSpeedY;
        
      }else if(pd.rx == 0){
        ballSpeedX = -ballSpeedX
      }
    }
    if (Ball.X <= Players.Player1[0].X + 100 && Ball.X + 64 >= Players.Player1[0].X && Ball.Y + 64 >= Players.Player1[0].Y && Ball.Y <= Players.Player1[0].Y + 100) {
      ballSpeedY = -this.normalize_value(pd2.ry);
      ballSpeedX = -this.normalize_value(pd2.rx);
      if(pd2.ry == 0){
        ballSpeedY = -ballSpeedY;
        
      }else if(pd2.rx == 0){
        ballSpeedX = -ballSpeedX
      }
      if(selected == 1){
        if(Ball.Y + 64 >= 160 && Ball.Y <= 287){
          ballSpeedX = speed_cpu;
        }else if(Ball.Y + 64 <= 160){
          ballSpeedX = -speed_cpu;
          ballSpeedY = -speed_cpu;
        }else if(Ball.Y >= 287){
          ballSpeedX = -speed_cpu;
          ballSpeedY = speed_cpu;
        }
        
      }
    }
    if(selected == 1){
      if (Players.Player1[0].Y < Ball.Y) {
        Players.Player1[0].Y += speed_cpu;
      } else {
        Players.Player1[0].Y -= speed_cpu; 
      }
      
      if (difficulty > 2){
        if (Ball.X + 64 > 320){
          Players.Player1[0].X -= speed_cpu;
        } 
      }
      
    }
    
  }

  MoveBall() {
    Ball.X -= ballSpeedX;
    Ball.Y -= ballSpeedY;

  }

  Play() {
    this.start();
    this.Move_paddles();
    this.MoveBall();  // Adicionando a movimentação da bola
    this.CollisionBall();
    this.draw();
    this.DesacelateBall();
    this.Check_gol();
    this.WinnerPlayer();
  }
}

const Game = new main();
os.setInterval(() => {
  Screen.clear();
  Game.SetScreen();
  Screen.waitVblankStart();
  Screen.flip();
  
}, 0);
