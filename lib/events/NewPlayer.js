import ClickEvent from './Click'
import DisconnectEvent from './Disconnect'
import ScoreEvent from './ScoreEvent'

class NewPlayerEvent {
    constructor(game, socket) {
        socket.on('newplayer', function () {
        
        let team;
        if((game.lastPlayderId+1)%2===0) team = 'orange'
        else team = 'teal'

            socket.player = {
                id: game.lastPlayderID++,
                x: game.randomInt(100,400),
                y: game.randomInt(100,400),
                team: team,
                playerPoints: 0
            }
            
            socket.broadcast.emit('newplayer', socket.player)
            socket.emit('allplayers', game.getAllPlayers())


            new ClickEvent(game, socket)
            new DisconnectEvent(game, socket)
            new ScoreEvent(game, socket)
        })
    }
}

export default NewPlayerEvent
