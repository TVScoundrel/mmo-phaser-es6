class ClickEvent {
    constructor(game, socket) {
        socket.on('click', function (data) {
            socket.player.x = data.x
            socket.player.y = data.y
            game.io.emit('move', socket.player)
        })
    }
}

export default ClickEvent
