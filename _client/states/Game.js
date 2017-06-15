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
        this.foodId = 0
        this.foodCount = 0
        this.initialFoodParams = [300,100,300,223,340,231,367,231,290,210]
    }


    preload() {
        this.game.stage.disableVisibilityChange = true
        this.game.load.tilemap('map', 'assets/map/backgroundMap.csv')
        this.game.load.image('tileset', 'assets/map/purps.png')
        this.game.load.image('orangeSprite','assets/sprites/orange-player.png')
        this.game.load.image('tealSprite','assets/sprites/teal-player.png')
        this.game.load.image('pizza','assets/sprites/pizza.png')
    }

    create() {

        // Scale the game to fill the entire page.
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        var map = this.game.add.tilemap('map',64,64)
        map.addTilesetImage('tileset')

        var layer
        for(var i = 0; i < map.layers.length; i++) {
            layer = map.createLayer(i)
        }
        console.log(layer)
        //layer.scale = {x:5, y:5}
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
        this.playerMap[id].width = 25;
        this.playerMap[id].height = 25;

        // anchor point to middle:
        this.playerMap[id].anchor.setTo(0.5, 0.5);

    }

    update(){
        // CHECK FOR SCORE UPDATES HERE AND REPOST SCOREBORD! //

        // Regenerating food
        if(this.foodCount < 5){
            let offSet = (5 - this.foodCount)
            for (var i = 0; i <= offSet; i++){
                let x = Math.floor(Math.random() * 500);
                let y = Math.floor(Math.random() * 500);
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
            if(playerLocation.x > foodLocation.x - 15 && playerLocation.x < foodLocation.x + 15){
                this.playerMap[id].width += 1;
                this.playerMap[id].height += 1;
                this.removeFood(food)
                this.foodCount--;
                this.score[this.playerMap[id].teamName]++;
            }
            console.log(this.score)

        })

    }

    growPlayer = function(id, x, y){
        ///grow player, emit info 
        // this.client.sendNewSize(x, y)
    }
    
    //copy this pattern for player BIGGER
    movePlayer = function(id, x, y){
        let player = this.playerMap[id];

        let superGlacial = 16;
        let glacial = 14;
        let slow = 12;
        let normalSpeed = 10;
        let fast = 8;
        let speedy = 6;
        let superSpeedy = 4;

        let speed = 4;

       
        let scale = Math.floor(player.scale.x * 100)

             if(scale <= 5){speed = superSpeedy}
        else if(scale <= 10){speed = speedy}
        else if(scale <= 15){speed = fast}
        else if(scale <= 20){speed = normalSpeed}
        else if(scale <= 25){speed = slow}
        else if(scale <= 30){speed = glacial}
        else if(scale >  35){speed = superGlacial}

        
        let distance = Phaser.Math.distance(player.x, player.y, x, y);
        let duration = distance * speed; //correlated to this.playerMap[id].width
        let tween = this.game.add.tween(player);
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
