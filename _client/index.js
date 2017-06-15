import Game from './states/Game'

class App extends Phaser.Game {
    constructor() {
        super(24*32, 17*32, Phaser.AUTO);
        //super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.WEBGL_MULTI);

        this.state.add('Game', Game)
        this.state.start('Game')
    }
}

new App();
