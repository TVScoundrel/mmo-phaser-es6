import Client from '../services/Client'

var tealTeam;
var orangeTeam;

class Game extends Phaser.State {
    constructor() {
        super()
        this.client = new Client(this)
        this.playerMap = {}

        this.state = {
            team: ''
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

        tealTeam = this.game.add.group();
        orangeTeam = this.game.add.group();

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
        if(this.state.team === 'orange'){this.playerMap[id] = this.game.add.sprite(x, y, 'orangeSprite')}
                                    else{this.playerMap[id] = this.game.add.sprite(x, y, 'tealSprite')}
        
        if(this.state.team === 'orange'){this.orangeTeam.add(this.playerMap[id])}
                                    else{this.tealTeam.add(this.playerMap[id])}

        this.playerMap[id].width = 25;
        this.playerMap[id].height = 25;
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
