import Client from '../services/Client'
let cursors;

class Game extends Phaser.State {
    constructor() {
        super()
        this.client = new Client(this)
        this.playerMap = {}
        this.tealTeamMap = {}
        this.orangeTeamMap = {}
        this.currentPlayer = {}
        this.score = {
            teal: 0,
            orange: 0
        }
        this.foodMap = {}
        this.foodId = 0
        this.foodCount = 0
        this.initialFoodParams = [300,100,300,223,340,231,367,231,290,210]
    }


    preload() {
        this.game.stage.disableVisibilityChange = true
        this.game.load.tilemap('map', 'assets/map/backgroundMap.csv')
        this.game.load.image('tileset', 'assets/map/floor1.png')
        this.game.load.image('orangeSprite','assets/sprites/orange-player.png')
        this.game.load.image('tealSprite','assets/sprites/teal-player.png')
        this.game.load.image('pizza','assets/sprites/pizza.png')
    }

    create() {

        // Scale the game to fill the entire page.
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //this.game.world.bounds.setTo(0, 0, 2000, 2000); // set the dimensions of the game world to those received from the server
        this.game.camera.bounds = new Phaser.Rectangle(0,0,2000,2000); // set the limits in which the camera can move
        var map = this.game.add.tilemap('map',64,64)
        map.addTilesetImage('tileset')

        var layer
        for(var i = 0; i < map.layers.length; i++) {
            layer = map.createLayer(i)
        }
        layer.inputEnabled = true

        //making food in game:
         let j = 0
         for (var i = 0; i < 5; i++){
                let newFood = this.game.add.sprite(this.initialFoodParams[j], this.initialFoodParams[j+1], 'pizza')
                newFood.anchor.setTo(0.5, 0.5);
                this.foodMap[this.foodId] = newFood
                this.foodId++;
                this.foodCount++;
                j+= 2
            }

        //STEP ONE:
        this.client.askNewPlayer()

        layer.events.onInputUp.add(this.getCoordinates, this)



    }

    getCoordinates(layer, pointer) {
        this.client.sendClick(pointer.worldX, pointer.worldY)
    }

    //STEP FOUR
    addNewPlayer(id, x, y, team) {
        if(id%2===0) team = 'orange'
        else team = 'teal'

        console.log('A new player just joined team', team)
        if(team === 'orange'){this.playerMap[id] = this.game.add.sprite(x, y, 'orangeSprite')}
                         else{this.playerMap[id] = this.game.add.sprite(x, y, 'tealSprite')}

        if(team === 'orange'){this.orangeTeamMap[id] = this.playerMap[id]}
                         else{this.tealTeamMap[id] = this.playerMap[id]}

        this.playerMap[id].width = 25;
        this.playerMap[id].height = 25;

        this.playerMap[id].anchor.setTo(0.5, 0.5);
        this.currentPlayer = this.playerMap[id]
        // console.log("currentPlayer", this.playerMap)
        // if(id === this.currentPlayer){

          this.game.camera.follow(this.currentPlayer, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT)
        //}
    }

    update(){
        // CHECK FOR SCORE UPDATES  HERE AND REPOST SCOREBORD! //

        // Regenerating food
        if(this.foodCount < 5){
            let offSet = (5 - this.foodCount)
            for (var i = 0; i <= offSet; i++){
                let x = Math.floor(Math.random() * 500);
                let y = Math.floor(Math.random() * 500);
                let newFood = this.game.add.sprite(x, y, 'pizza')
                newFood.anchor.setTo(0.5, 0.5);
                this.foodMap[this.foodId] = newFood
                // this.foodMap[i] = newFood
                this.foodId++
                this.foodCount++
            }
        }
    }



    eatFood = function(id){

        let playerLocation = this.playerMap[id].worldPosition

        Object.keys(this.foodMap).forEach(food => {
            let foodLocation = this.foodMap[food].worldPosition
            if(playerLocation.x > foodLocation.x - 15 && playerLocation.x < foodLocation.x + 15){
                this.playerMap[id].width += 5 //2;
                this.playerMap[id].height += 5 //2;
                this.removeFood(food)
                this.foodCount--;
            }

        })

    }

    //copy this pattern for player collide possibly...
    movePlayer = function(id, x, y){
        var player = this.playerMap[id];
        var distance = Phaser.Math.distance(player.x, player.y, x, y);
        var duration = distance * 5; //correlate to this.playerMap[id].width
        var tween = this.game.add.tween(player);
        tween.to({ x, y }, duration);
        tween.start();
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
