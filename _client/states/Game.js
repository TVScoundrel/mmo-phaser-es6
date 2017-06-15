import Client from '../services/Client'

class Game extends Phaser.State {
    constructor() {
        super()
        this.client = new Client(this)
        this.playerMap = {}

        this.state = {
            team: '',
            teams: []
        }
    }
   


    preload() {
        this.game.stage.disableVisibilityChange = true
        this.game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON)
        this.game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32)
        this.game.load.image('orangeSprite','assets/sprites/orange-player.png')
        this.game.load.image('tealSprite','assets/sprites/teal-player.png')
    }

    create() {

        const tealTeam = this.game.add.group();
        const orangeTeam = this.game.add.group();
        this.state.teams = [tealTeam, orangeTeam]

        let coin = Math.floor(Math.random()*2)
        if(coin === 0){this.state.team = 'orange'}
        else{this.state.team = 'teal'}


        var map = this.game.add.tilemap('map')
        map.addTilesetImage('tilesheet', 'tileset')
        var layer
        for(var i = 0; i < map.layers.length; i++) {
            layer = map.createLayer(i)
        }

        layer.inputEnabled = true
        this.client.askNewPlayer()

        layer.events.onInputUp.add(this.getCoordinates, this)
    }

    getCoordinates(layer, pointer) {
        this.client.sendClick(pointer.worldX, pointer.worldY)
    }

    addNewPlayer(id, x, y) {
        let oTeam = this.state.teams[1]
        let tTeam = this.state.teams[0]
        
        if(this.state.team === 'orange'){this.playerMap[id] = this.game.add.sprite(x, y, 'orangeSprite')}
                                    else{this.playerMap[id] = this.game.add.sprite(x, y, 'tealSprite')}
        
        this.playerMap[id].width = 25;
        this.playerMap[id].height = 25;
        
        //hits this, but doesn't add to team and like, mutates the player?
        if(this.state.team === 'orange'){oTeam.add(this.playerMap[id])}
                                     else{tTeam.add(this.playerMap[id])}

        console.log('TEAL TEAM from state:', this.state.teams[0])

    }



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
