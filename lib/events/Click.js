class ClickEvent {
    constructor(game, socket) {
        socket.on('click', function (data) {
            socket.player.x = data.x - 30
            socket.player.y = data.y - 40
            game.io.emit('move', socket.player)
        })
    }
}

export default ClickEvent
