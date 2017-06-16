import Client from '../services/Client'
let cursors;

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
        this.initialFoodParams = [111,100,388,342,931,222,222,777,290,999,111,100,388,342,931,222,222,777,290,999]
    }


    preload() {
        this.game.stage.disableVisibilityChange = true
        this.game.load.tilemap('map', 'assets/map/backgroundMap.csv')
        this.game.load.image('tileset', 'assets/map/floor1.png')
        this.game.load.image('orangeSprite','assets/sprites/orange-player.png')
        this.game.load.image('tealSprite','assets/sprites/teal-player.png')
        this.game.load.image('pizza','assets/sprites/pizza.png')
        this.game.load.image('pizza','assets/sprites/logo.png')
    }

    create() {
        let logo = this.game.add.sprite(0, 200, 'assets/sprites/logo.png');
        logo.fixedToCamera = true;

        let camX = 0;
        let camY = 0;
        
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
         for (var i = 0; i < 20; i++){
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

        // anchor point to middle:
        this.playerMap[id].anchor.setTo(0.5, 0.5);

        

        this.game.camera.follow(this.playerMap[id], Phaser.Camera.FOLLOW_TOPDOWN_TIGHT)
    }

    update(){
        // CHECK FOR SCORE UPDATES  HERE AND REPOST SCOREBORD! //

        // Regenerating food
        if(this.foodCount < 20){
            let offSet = (20 - this.foodCount)
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
            if(playerLocation.x > foodLocation.x - 15 && playerLocation.x < foodLocation.x + 15){
                this.playerMap[id].width += 3;
                this.playerMap[id].height += 3;
                this.removeFood(food)
                this.foodCount--;
                this.score[this.playerMap[id].teamName]++;
                this.growPlayer(id, this.playerMap[id].width, this.playerMap[id].height, this.playerMap[id].x, this.playerMap[id].y)
            }

        })

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
