import Game from '../states/Game'

class Client {

    constructor(theGame) {
        this.socket = io.connect()
        var game = theGame

        //STEP THREE:
        this.socket.on('newplayer',function(data){
            game.addNewPlayer(data.id, data.x, data.y, data.width, data.height)
        })

        this.socket.on('allplayers',function(data){
            for(var i = 0; i < data.length; i++){
                game.addNewPlayer(data[i].id, data[i].x, data[i].y, data.width, data.height)
            }
        })

        this.socket.on('move',function(data){
            game.movePlayer(data.id,data.x,data.y);
            game.eatFood(data.id);
            game.attackEnemy(data.id);
            game.updateScore(data.id)
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
    

    sendSize(id, x, y, width, height) {
        let data = { id, x, y, width, height, destroy: true }
        this.socket.emit('allplayers', data)
    }
}

export default Client
