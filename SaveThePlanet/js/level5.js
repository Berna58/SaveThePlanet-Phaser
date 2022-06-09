class level5 extends Phaser.Scene {

  constructor ()
{
  super({ key: 'level5' });

  // Variáveis
  this.platform;
  this.player;
  this.cursors;
  this.coins;
  this.score = 0;
  this.scoreText;
  this.levelText;
  this.bombs;
  this.button;
  this.gameOver = false;
  this.lifeCount = 3;
  this.isDead = false;
  this.ssText;
  this.life;
  this.explode;
  this.press;
  this.win;
  this.collect;
}

preload()
{
  // Load das Imagens
  this.load.image('bgl5', 'assets/level5/bgl5.png');
  this.load.image('platL5', 'assets/level5/platL5.png');
  this.load.image('coin','assets/coin.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.image('plat2L5', 'assets/level5/platL5_2.png');
  this.load.image('spike', 'assets/spikes.png');
  this.load.image('heart', 'assets/heart.png');
  this.load.image('bglife', 'assets/bg_life.png');
  this.load.image('bgcoin', 'assets/bg_coin.png');
  this.load.image('bglevel', 'assets/bg_level.png');

  // Load da Sprite do Player e dos animais
  this.load.spritesheet('boy', 'assets/boy1.png', {frameWidth: 47, frameHeight: 47});

  // Load do Audio
  this.load.audio('game', [ 'assets/audio/sound_game.mp3']);
  this.load.audio('explode', [ 'assets/audio/explode.mp3']);
  this.load.audio('life', [ 'assets/audio/life.mp3']);
  this.load.audio('buttonpress', [ 'assets/audio/buttonpress.mp3']);
  this.load.audio('win', [ 'assets/audio/win.mp3']);
  this.load.audio('collect', [ 'assets/audio/collect.mp3']);
}

create()
{
  // Imagens de background da pontuação, vidas e nivel e do fundo do nivel
  this.add.image(400, 300, 'bgl5');
  this.add.image(678, 33, 'bglife');
  this.add.image(100, 33, 'bgcoin');
  this.add.image(370, 35, 'bglevel');

  // Adicionado o som com o volume
  this.explode = this.sound.add("explode", {volume: 0.3});
  this.life = this.sound.add("life", {volume: 0.3});
  this.press = this.sound.add("buttonpress", {volume: 0.3});
  this.win = this.sound.add("win", {volume: 0.3});
  this.collect = this.sound.add("collect", {volume: 0.3});


  // adicionar as plataformas do jogo com físicas
  this.spikes = this.physics.add.staticGroup();
  this.stuff = this.physics.add.staticGroup();
  this.platforms = this.physics.add.staticGroup();

  // Botão para voltar para o Menu
  this.button1 = this.add.image(770, 70, 'buttonback').setScale(0.5).setInteractive({ useHandCursor: true });

  // -- click no botao
  this.button1.once('pointerdown', function (pointer)  { 
    
    this.scene.start('menu'); 
    this.press.play();
  
  }, this);


  // Criação das plataformas
  this.platforms.create(150, 150, 'plat2L5');
  this.platforms.create(400, 300, 'plat2L5');
  this.platforms.create(700, 400, 'plat2L5');
  this.spikes.create(100, 500, 'spike');
  this.spikes.create(300, 500, 'spike');
  this.spikes.create(500, 500, 'spike');
  this.spikes.create(700, 500, 'spike');
  this.platforms.create(195, 568, 'platL5').refreshBody();

  // adicionar o player
  this.player = this.physics.add.sprite(100, 50, 'boy');

  this.player.setBounce(0.2);
  this.player.setCollideWorldBounds(true);

  // criar animaçoes
  this.anims.create ({
      key: 'left',
      frames: this.anims.generateFrameNumbers('boy', {start: 3, end: 5}),
      frameRate: 10,
      repeat: -1

  });

  this.anims.create ({
      key: 'right',
      frames: this.anims.generateFrameNumbers('boy', {start: 6, end: 8}),
      frameRate: 10,
      repeat: -1

  });

  this.anims.create ({
      key: 'turn',
      frames: [{ key: 'boy', frame: 1}],
      frameRate: 20

  });

  // colisao do player com as plataformas
  this.physics.add.collider(this.player, this.platforms);

  // adicionar interação com as teclas do cursor
  this.cursors = this.input.keyboard.createCursorKeys();

  // criar as estrelas
  this.coins = this.physics.add.group( {
      key: 'coin',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70},
  });

  // animar as estrelas
  this.coins.children.iterate(function(child) 
  {
      child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
  });

  // colisao das estrelas com as plataformas
  this.physics.add.collider(this.coins, this.platforms);

  // Texto para a pontuação e para o Nivel
  this.scoreText = this.add.text(10, 20, '', {fontSize: 'bold 32px', fill: '#000'});
  this.levelText = this.add.text(310, 20, 'LEVEL 5', { font: 'bold 30px Arial', fill: '#000'});

  // recolha das estrelas
  this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this );

  // grupo de bombas
  this.bombs = this.physics.add.group();

  // Colisao das bombas com as plataformas
  this.physics.add.collider(this.bombs, this.platforms);

  // Colisao das bombas com o player e executa a função hitBomb 
  this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

  // Colisao dos spikes com o player e executa a função hitSpike
  this.physics.add.collider(this.player, this.spikes, this.hitSpike, null, this);

  // Adicionar as vidas
  this.life1 = this.add.image(650 , 35, 'heart').setScrollFactor(0);
  this.life2 = this.add.image(700 , 35, 'heart').setScrollFactor(0);
  this.life3 = this.add.image(750 , 35, 'heart').setScrollFactor(0);

  

}

 // Função para recolha das estrelas
collectCoin(player, coins)
{
  this.score += 1;
  this.scoreText.setText('     ' + this.score);
  this.collect.play();

  coins.disableBody(true, true);

  // verificar se ainda há estrelas ativas
  if (this.coins.countActive(true) == 11)
  {

      // calcular a posição da bomba em função da posiçao do player
      var x = (player.x < 400) ?
          Phaser.Math.Between(400, 800):
          Phaser.Math.Between(0, 400);

      var bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
  }
  else if(this.coins.countActive(true) == 0)
  {
      this.coins.children.iterate(function(child)
      {
          child.enableBody(true, child.x, 0, true, true);
      });
  }
}

// hitbomb
hitBomb(player, bomb)
{
  // É retirado 1 vida sempre que colidir com a bomba e executa os sons, dá um shake na tela e as vidas vao desaparecendo 
  this.lifeCount -= 1;

  if ( this.lifeCount === 2) 
  {
      this.life.play();
      this.cameras.main.shake(100);
      this.life3.setVisible(false);
  } 
  else if ( this.lifeCount === 1) 
  {
      this.life.play();
      this.cameras.main.shake(100);
      this.life2.setVisible(false);
  } 
  else if ( this.lifeCount === 0) 
  {
      this.explode.play();
      this.cameras.main.shake(500);
      this.life1.setVisible(false);
      this.isDead = true;     
  }
  if ( this.isDead ) 
  {
    this.time.delayedCall(200,function() 
      {
        this.isDead = false;
        this.lifeCount = 3;
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.score = 0;
        this.scene.restart();
      
      },[], this);
  }

}

// hitSpike
hitSpike(player, spikes)
{
  // Definido um delay apos a colisao
  this.time.delayedCall(200,function() 
  {
    this.explode.play();
    this.isDead = false;
    this.lifeCount = 3;
    this.player.setTint(0xff0000);
    this.player.anims.play('turn');
    this.score = 0;
    this.scene.start('gameover');
  
  },[], this);  
        
}


update()
{
  if (this.gameOver)
  {
      return;
  }
   // Definido a animação ao premir a tecla SETA ESQUERDA
  if ( this.cursors.left.isDown)
  {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
  }
  // Definido a animação ao premir a tecla SETA DIREITA
  else if (this.cursors.right.isDown)
  {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
  }
  else
  {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
  }

  // Definido a animação ao premir a tecla SETA CIMA
  if (this.cursors.up.isDown && this.player.body.touching.down)
  {
      this.player.setVelocityY(-350);
  }
  // Definido o score necessario para passar para o nivel seguinte
  if ( this.score == 24 ) 
  {
      this.scene.start("win");
      this.win.play();
  }

}

}