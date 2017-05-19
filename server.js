import express from 'express'
import http from 'http'
import Game from './lib/Game'

var app = express()
var server = http.Server(app)

app.use('/',express.static(__dirname + '/bin/client'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/vendor',express.static(__dirname + '/vendor'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/bin/client/index.html');
});

server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on ' + server.address().port);
});

var game = new Game(server)
