import Client from '../services/Client'

class Game extends Phaser.State {
    constructor() {
        super()
        this.client = new Client(this)
        this.playerMap = {}
    }

    preload() {
        this.game.stage.disableVisibilityChange = true
        this.game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON)
        this.game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32)
        this.game.load.image('sprite','assets/sprites/sprite.png')
    }

    create() {
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
        this.playerMap[id] = this.game.add.sprite(x, y, 'sprite');
    }

    movePlayer = function(id, x, y){
        var player = this.playerMap[id];
        var distance = Phaser.Math.distance(player.x, player.y, x, y);
        var duration = distance * 10;
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
