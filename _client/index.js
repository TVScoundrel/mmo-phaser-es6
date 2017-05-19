import Game from './states/Game'

class App extends Phaser.Game {
    constructor() {
        super(24*32, 17*32, Phaser.AUTO);

        this.state.add('Game', Game)
        this.state.start('Game')
    }
}

new App();
