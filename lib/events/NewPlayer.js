import ClickEvent from './Click'
import DisconnectEvent from './Disconnect'

class NewPlayerEvent {
    constructor(game, socket) {
        socket.on('newplayer', function () {
            socket.player = {
                id: game.lastPlayderID++,
                x: game.randomInt(100,400),
                y: game.randomInt(100,400)
            }

            socket.emit('allplayers', game.getAllPlayers())
            socket.broadcast.emit('newplayer', socket.player)

            new ClickEvent(game, socket)
            new DisconnectEvent(game, socket)
        })
    }
}

export default NewPlayerEvent
