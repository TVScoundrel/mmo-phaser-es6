import Fonts from './states/Fonts'
import Game from './states/Game'

class App extends Phaser.Game {
    constructor() {
        super(1950, 1070, Phaser.AUTO);

        this.state.add('Fonts', Fonts)
        this.state.add('Game', Game)
        this.state.start('Fonts')
    }
}

new App();
