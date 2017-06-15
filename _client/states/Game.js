import Client from '../services/Client'

class Game extends Phaser.State {
    constructor() {
        super()
        this.client = new Client(this)
        this.playerMap = {}
        this.teamMap = {}
        this.foodMap = {}

        this.state = {
            team: '',
            teams: [],
            foodCount: 0
        }
    }


    preload() {
        this.game.stage.disableVisibilityChange = true
        this.game.load.tilemap('map', 'assets/map/backgroundMap.csv')
        this.game.load.image('tileset', 'assets/map/purps.png')
        this.game.load.image('orangeSprite','assets/sprites/orange-player.png')
        this.game.load.image('tealSprite','assets/sprites/teal-player.png')
        this.game.load.image('pizza','assets/sprites/teal-player.png')
    }

    create() {
        // Scale the game to fill the entire page.
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        const tealTeam = this.game.add.group();
        const orangeTeam = this.game.add.group();
        const food = this.game.add.group()

        this.state.teams = [tealTeam, orangeTeam]

        let coin = Math.floor(Math.random()*2)
        if(coin === 0){this.state.team = 'orange'}
        else{this.state.team = 'teal'}


        var map = this.game.add.tilemap('map',64,64)
        map.addTilesetImage('tileset')
        var layer
        for(var i = 0; i < map.layers.length; i++) {
            layer = map.createLayer(i)
        }
        console.log(layer)
        //layer.scale = {x:5, y:5}
        layer.inputEnabled = true


        //STEP ONE:
        this.client.askNewPlayer()

        layer.events.onInputUp.add(this.getCoordinates, this)
    }

    getCoordinates(layer, pointer) {
        this.client.sendClick(pointer.worldX, pointer.worldY)
    }

    //STEP FOUR
    addNewPlayer(id, x, y) {

        let oTeam = this.state.teams[1]
        let tTeam = this.state.teams[0]

        if(this.state.team === 'orange'){this.playerMap[id] = this.game.add.sprite(x, y, 'orangeSprite')}
                                    else{this.playerMap[id] = this.game.add.sprite(x, y, 'tealSprite')}

        this.playerMap[id].width = 25;
        this.playerMap[id].height = 25;

        //hits this and adds to team, doesn't render the player?
        // if(this.state.team === 'orange'){oTeam.add(this.playerMap[id])}
        //                              else{tTeam.add(this.playerMap[id])}

        console.log('TEAL TEAM from state:', this.state.teams[0])

    }

    makeFood(){
        console.log('in make food')
        if(this.state.foodCount < 50){
            console.log('making food')
            let offSet = (50 - this.state.foodCount)
            for (var i = 0; i <= offSet; i++){
                this.foodMap[i] = this.game.add.sprite(Math.floor(Math.random() * 200), Math.floor(Math.random() * 200), 'pizza')
                this.state.foodCount++
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

    removePlayer = function(id){
        this.playerMap[id].destroy();
        delete this.playerMap[id];
    }
}

export default Game
