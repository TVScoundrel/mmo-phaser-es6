import Game from '../states/Game'

class Client {

    constructor(theGame) {
        this.socket = io.connect()
        var game = theGame

        //STEP THREE:
        this.socket.on('newplayer',function(data){
            //do the coin toss here
            game.addNewPlayer(data.id, data.x, data.y)
            //game.makeFood()
        })

        this.socket.on('allplayers',function(data){
            for(var i = 0; i < data.length; i++){
                game.addNewPlayer(data[i].id, data[i].x, data[i].y)
            }
        })

        this.socket.on('move',function(data){
            game.movePlayer(data.id,data.x,data.y);
        })

        this.socket.on('remove',function(id){
            game.removePlayer(id);
        })
    }

    //STEP TWO:
    askNewPlayer() {
        this.socket.emit('newplayer')
    }

    sendClick(x, y) {
        this.socket.emit('click', { x, y })
    }
}

export default Client
