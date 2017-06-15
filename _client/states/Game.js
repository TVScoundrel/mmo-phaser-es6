import Client from '../services/Client'

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
        this.foodCount = 0
        this.initialFoodParams = [400,100,300,250,340,231,367,789,654,432]
    }
   


    preload() {
        this.game.stage.disableVisibilityChange = true
        this.game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON)
        this.game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32)
        this.game.load.image('orangeSprite','assets/sprites/orange-player.png')
        this.game.load.image('tealSprite','assets/sprites/teal-player.png')
        this.game.load.image('pizza','assets/sprites/pizza.png')
    }

    create() {

        var map = this.game.add.tilemap('map')
        map.addTilesetImage('tilesheet', 'tileset')
        var layer
        for(var i = 0; i < map.layers.length; i++) {
            layer = map.createLayer(i)
        }

        layer.inputEnabled = true

        //making food in game:
         let j = 0
         for (var i = 0; i < 5; i++){
                
                let newFood = this.game.add.sprite(this.initialFoodParams[j], this.initialFoodParams[j+1], 'pizza')
                this.foodMap[i] = newFood
                this.foodCount++
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

    }

    update(){
        // CHECK FOR SCORE UPDATES HERE AND REPOST SCOREBORD! //

        if(this.foodCount < 5){
            let offSet = (5 - this.foodCount)
            for (var i = 0; i <= offSet; i++){
                console.log('making NEW food')
                let newFood = this.game.add.sprite(Math.floor(Math.random()*100), Math.floor(Math.random()*100), 'pizza')
                this.foodMap[i] = newFood
                this.foodCount++
            }
        }   
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
