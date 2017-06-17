class ClickEvent {
    constructor(game, socket) {
        socket.on('click', function (data) {
            socket.player.x = data.x
            socket.player.y = data.y
            socket.player.playerPoints = data.playerPoints
            socket.player.teamName = data.teamName
            
            game.io.emit('move', socket.player)
        })
    }
}

export default ClickEvent
