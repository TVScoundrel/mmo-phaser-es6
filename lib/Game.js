import ConnectionEvent from './events/Connection'

class Game {
    constructor(app) {
        this.lastPlayderID = 0
        this.io = require('socket.io')(app)
        new ConnectionEvent(this)
    }

    getAllPlayers() {
        var players = []
        var self = this
        Object.keys(self.io.sockets.connected).forEach(function (socketID) {
            var player = self.io.sockets.connected[socketID].player
            if (player) players.push(player)
        })
        return players
    }

    randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }
}

export default Game
