const http = require('http');
const express = require('express');
const app = express();

const Datastore = require('nedb');

const db = {
  players: new Datastore({filename:'db/players', autoload:true })
};

const config  = require('./config');

(function initWebpack() {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack/common.config');
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
  }));

  app.use(express.static(__dirname + '/'));
})();

app.get(/.*/, function root(req, res) {
  res.sendFile(__dirname + '/index.html');
});

const server = http.createServer(app);
server.listen(process.env.PORT || 3000, function onListen() {
  const address = server.address();
  console.log('Listening on: %j', address);
  console.log(' -> that probably means: http://localhost:%d', address.port);
});

var socket_io = require('socket.io');
var io = socket_io();
io.attach(server);

const updatePlayers = function(socket) {
  db.players.find({}).exec((err, players)=>{
    socket.emit('action', {type:'players', data:players});
    const busyColors = players.reduce(function (colors, player) {
      colors[player.colorId] = true;
      return colors;
    }, {});
    console.log(busyColors);
    const freeColors = config.colors.filter(function(color) {
      return !busyColors[color.id];
    })
    socket.emit('action', {type:'colors', data:freeColors});
  })
}
io.on('connection', function(socket){

  db.players.find({}).exec((err, players)=>{
    socket.emit('action', {type:'players', data:players});
    updatePlayers(socket);
  })
  socket.on('action', (action) => {
    console.log(action);
    if(action.type === 'server/add_player'){
      db.players.insert({scores:0, ...action.data}, function (err, newPlayer) {
        if(!err){
          updatePlayers(io);
        }
      });
    }else if(action.type === 'server/delete_player'){
      db.players.remove({color:action.data}, function (err, newPlayer) {
        if(!err){
          updatePlayers(io);
        }
      });
    }
  });
});