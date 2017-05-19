import NewPlayerEvent from './NewPlayer'

class ConnectionEvent {
    constructor(game) {
        game.io.on('connection', function (socket) {
            new NewPlayerEvent(game, socket)
        })
    }
}

export default ConnectionEvent
