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
// let sockets = {};
const updatePlayers = function(socket) {
  db.players.find({}).exec((err, players)=>{
    socket.emit('action', {type:'players', data:players});
  })
}
io.on('connection', function(socket){
  // sockets[socket.id] = socket;
  socket.emit('action', {type:'colors', data:config.colors});
  db.players.find({}).exec((err, players)=>{
    socket.emit('action', {type:'players', data:players});
    updatePlayers(socket);
  })
  socket.on('action', (action) => {
    console.log(action);
    if(action.type === 'server/add_player'){
      db.players.insert(action.data, function (err, newPlayer) {
        if(!err){
          updatePlayers(io);
        }
      });

    }
  });
  // socket.on('disconnect', function() {
  //   console.log(`disconnect ${socket.id}`);
  //   delete sockets[socket.id];
  // })
});