class ScoreEvent {
    constructor(game, socket) {
        socket.on('move', function (data) {
            socket.player.playerPoints = data.playerPoints
            socket.player.teamName = data.teamName
            game.io.emit('newScore', socket.player)
        })
    }
}

export default ScoreEvent
