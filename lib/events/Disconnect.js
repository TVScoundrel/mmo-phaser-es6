class DisconnectEvent {
    constructor(game, socket) {
        socket.on('disconnect', function () {
            game.io.emit('remove', socket.player.id)
        })
    }
}

export default DisconnectEvent
