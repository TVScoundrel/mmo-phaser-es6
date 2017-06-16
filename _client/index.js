import Fonts from './states/Fonts'
import Game from './states/Game'

class App extends Phaser.Game {
    constructor() {
        super(1950, 1070, Phaser.AUTO);
        //super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

        this.state.add('Fonts', Fonts)
        this.state.add('Game', Game)
        this.state.start('Fonts')
    }
}

new App();
