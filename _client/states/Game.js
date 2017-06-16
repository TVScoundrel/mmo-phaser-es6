import Client from '../services/Client'
let orangeText;
let gameOver;

class Game extends Phaser.State {
    constructor() {
        super()
        this.client = new Client(this)
        this.playerMap = {}
        this.tealTeamMap = {}
        this.orangeTeamMap = {}
        this.score = {
            teal: 0,
            orange: 0
        }
        this.foodMap = {}
        this.foodId = 0
        this.foodCount = 0
        let x = () => {Math.floor(Math.random() * 2000)}
        this.initialFoodParams = [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x]
    }

    preload() {
        this.game.stage.disableVisibilityChange = true
        this.game.load.tilemap('map', 'assets/map/backgroundMap.csv')
        this.game.load.image('tileset', 'assets/map/floor1.png')
        this.game.load.image('orangeSprite','assets/sprites/orange-player.png')
        this.game.load.image('tealSprite','assets/sprites/teal-player.png')
        this.game.load.image('pizza','assets/sprites/pizza.png')
        this.game.load.image('pizza','assets/sprites/logo.png')


        // this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        // this.game.scale.setUserScale(1, 1);
        // this.game.renderer.renderSession.roundPixels = true;
        // Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    }

    create() {
      Phaser.ScaleManager.prototype.setScreenSize = Phaser.ScaleManager.prototype.updateLayout;

      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
      this.game.scale.setScreenSize(true);

        let logo = this.game.add.sprite(0, 200, 'assets/sprites/logo.png');
        logo.fixedToCamera = true;

        let camX = 0;
        let camY = 0;

        //this.game.camera.bounds = new Phaser.Rectangle(0,0,2000,2000); // set the limits in which the camera can move
        var map = this.game.add.tilemap('map',64,64)
        map.addTilesetImage('tileset')

        var layer
        for(var i = 0; i < map.layers.length; i++) {
            layer = map.createLayer(i)
        }
        layer.inputEnabled = true


        //making food in game:
         let j = 0
         for (var i = 0; i < 40; i++){
                let newFood = this.game.add.sprite(this.initialFoodParams[j], this.initialFoodParams[j+1], 'pizza')
                newFood.anchor.setTo(0.5, 0.5);
                this.foodMap[this.foodId] = newFood
                this.foodId++;
                this.foodCount++;
                j+= 2
            }

        //STEP ONE:
        this.client.askNewPlayer()
        console.log(this.playerMap)
        layer.events.onInputUp.add(this.getCoordinates, this)

        let leaderboard = this.game.add.text(this.world.centerX - 265, this.world.centerY -245, "Leaderboard")
        leaderboard.fixedToCamera= true;
        leaderboard.font = 'Audiowide'
        leaderboard.padding.set(10, 16)
        leaderboard.fontSize = 30
        leaderboard.fill = 'white'
        //leaderboard.smoothed = false
        leaderboard.anchor.setTo(0.5)
        orangeText = this.game.add.text(this.world.centerX - 255, this.world.centerY -207, "Orange Team:  0 \nTeal Team:  0")
        orangeText.fixedToCamera= true;
        orangeText.font = 'Audiowide'
        orangeText.fontSize = 20
        orangeText.fill = 'white'
        orangeText.anchor.setTo(0.5)
        orangeText.lineSpacing = -6

        // gameOver = function(){
        //   console.log("GAME OVER TEXT")
        //   let gameOverText = this.game.add.text(this.world.centerX -240, this.world.centerY -200, "GAME OVER")
        //   gameOverText.fixedToCamera= true;
        //   gameOverText.font = 'Audiowide'
        //   gameOverText.fontSize = 40
        //   gameOverText.fill = 'purple'
        //   gameOverText.anchor.setTo(0.5)
        // }


    }

    getCoordinates(layer, pointer) {
        this.client.sendClick(pointer.worldX, pointer.worldY)
    }

    //STEP FOUR
    addNewPlayer(id, x, y, width, height) {

        let team;
        if(id%2===0) team = 'orange'
        else team = 'teal'

        console.log('A new player just joined team', team)

        // CREATE THE PLAYER:
        if(team === 'orange'){this.playerMap[id] = this.game.add.sprite(x, y, 'orangeSprite')}
                         else{this.playerMap[id] = this.game.add.sprite(x, y, 'tealSprite')}

        // ADD TO TEAM MAP:

        if(team === 'orange'){this.orangeTeamMap[id] = this.playerMap[id]}
                         else{this.tealTeamMap[id] = this.playerMap[id]}

        // ADD TEAM PROPERTY TO PLAYER?
        if(team === 'orange'){this.orangeTeamMap[id].teamName = 'orange'}
                         else{this.tealTeamMap[id].teamName = 'teal'}

        // SET PLAYER SIZE:
        this.playerMap[id].width = width || 25;
        this.playerMap[id].height = height || 25;

        //every player earns their own points
        this.playerMap[id].playerPoints = 0;

        // anchor point to middle:
        this.playerMap[id].anchor.setTo(0.5, 0.5);



        //this.game.camera.follow(this.playerMap[id], Phaser.Camera.FOLLOW_TOPDOWN_TIGHT)
    }

    update(){
        // CHECK FOR SCORE UPDATES  HERE AND REPOST SCOREBORD! //
        let orangeFirst = "1st - Orange Team:  "+this.score.orange+ "\n2nd - Teal Team:  "+this.score.teal
        let tealFirst = "1st - Teal Team:  "+this.score.teal+ "\n2nd - Orange Team:  "+this.score.orange
        if(this.score.teal > this.score.orange){
          orangeText.setText(tealFirst)
        }else if(this.score.orange > this.score.teal){
          orangeText.setText(orangeFirst)
        }

        // Regenerating food
        if(this.foodCount < 40){
            let offSet = (40 - this.foodCount)
            for (var i = 0; i <= offSet; i++){
                console.log('making more food')
                let x = Math.floor(Math.random() * 2000);
                let y = Math.floor(Math.random() * 2000);
                let newFood = this.game.add.sprite(x, y, 'pizza')
                newFood.anchor.setTo(0.5, 0.5);
                this.foodMap[this.foodId] = newFood;
                this.foodId++
                this.foodCount++
            }
        }
    }



    eatFood = function(id){

        let playerLocation = this.playerMap[id].worldPosition

        Object.keys(this.foodMap).forEach(food => {
            let foodLocation = this.foodMap[food].worldPosition

            if(playerLocation.x > foodLocation.x - 12 && playerLocation.x < foodLocation.x + 12){
                this.playerMap[id].width += 3;
                this.playerMap[id].height += 3;
                this.removeFood(food)
                this.foodCount--;
                this.playerMap[id].playerPoints += 1
                this.growPlayer(id, this.playerMap[id].width, this.playerMap[id].height, this.playerMap[id].x, this.playerMap[id].y)
            }

        })

    }

    attackEnemy = function(id){

        let playerLocation = this.playerMap[id].worldPosition

        Object.keys(this.playerMap).forEach(enemy => {
            if(this.playerMap[enemy] !== this.playerMap[id]){
                let enemyLocation = this.playerMap[enemy].worldPosition

                // changed this: (Math.abs(this.playerMap[enemy].width - this.playerMap[id].width) < 15) might be too much?
                if((Math.abs(playerLocation.x - enemyLocation.x ) < 5) && (this.playerMap[id].width - this.playerMap[enemy].width >= 30 && this.playerMap[enemy].teamName !== this.playerMap[id].teamName)){
                    console.log('enemy was sucessfully attacked.')
                    this.playerMap[id].playerPoints += Math.floor(this.playerMap[enemy].width/2);
                    this.removePlayer(enemy)
                    let gameOverText = this.game.add.text(this.world.centerX -240, this.world.centerY -200, "GAME OVER")
                    gameOverText.fixedToCamera= true;
                    gameOverText.font = 'Audiowide'
                    gameOverText.fontSize = 40
                    gameOverText.fill = 'purple'
                    gameOverText.anchor.setTo(0.5)
                    function set(){return gameOverText.setText("")}
                    setTimeout(set, 4000)
             } else if((Math.abs(playerLocation.x - enemyLocation.x ) < 5) && (this.playerMap[enemy].width - this.playerMap[id].width) <= 30 && this.playerMap[enemy].teamName !== this.playerMap[id].teamName){
                    console.log('you are being attacked!')
                        this.playerMap[id].destroy();
                        delete this.playerMap[id];
                        ///GAME OVER!!!///
                }
            }


            }

        )

    }

    updateScore(id){
        console.log(this.playerMap[id].teamName, 'scored a point!')

        if(this.playerMap[id].teamName === 'orange'){
            this.score.orange += Math.floor(this.playerMap[id].playerPoints)
        }
        else if(this.playerMap[id].teamName === 'teal'){
            this.score.teal += Math.floor(this.playerMap[id].playerPoints)
        }

        console.log(this.score)

        //reset player's points:
        this.playerMap[id].playerPoints = 0;

    }

    growPlayer = function(id, width, height, x, y){
        ///grow player, emit info
        this.client.sendSize(id, width, height, x, y)
    }

    //copy this pattern for player BIGGER
    movePlayer = function(id, x, y){
        let player = this.playerMap[id];

        let superGlacial = 15;
        let glacial = 13;
        let slow = 12;
        let normalSpeed = 9;
        let fast = 7;
        let speedy = 5;
        let superSpeedy = 4;

        let speed = 4;

        let scale = Math.floor(player.scale.x * 100)

             if(scale <= 5){speed = superSpeedy}
        else if(scale <= 45){speed = speedy}
        else if(scale <= 55){speed = fast}
        else if(scale <= 65){speed = normalSpeed}
        else if(scale <= 75){speed = slow}
        else if(scale <= 95){speed = glacial}
        else if(scale >  105){speed = superGlacial}


        let distance = Phaser.Math.distance(player.x, player.y, x, y);
        let duration = distance * speed; //correlated to this.playerMap[id].width
        let tween = this.game.add.tween(player);
        tween.to({ x, y }, duration);
        tween.start();

    }

    resize (id) {
        this.gameMap[id].destroy();
        delete this.gameMap[id];
        console.log('she got deleted')
    }

    removeFood = function(id){
        this.foodMap[id].destroy();
        delete this.foodMap[id];
    }

    removePlayer = function(id){
        this.playerMap[id].destroy();
        delete this.playerMap[id];
    }
}

export default Game
