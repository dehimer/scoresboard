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

const syncActivePlayers = socket => {
  db.players.find({colorId: {$ne:'0'}}).exec((err, players) => {
    console.log('active_players');
    console.log(players);
    socket.emit('action', {type:'active_players', data:players});
  });
}

const syncFreeColors = socket => {
  db.players.find({colorId: {$ne:'0'}}).exec((err, players) => {

    //free colors
    const busyColors = players.reduce((colors, player) => {
      colors[player.colorId] = true;
      return colors;
    }, {});
    
    const freeColors = config.colors.filter(color => {
      return !busyColors[color.id];
    });
    socket.emit('action', {type:'free_colors', data:freeColors});
  });
}

const syncTop20 = socket => {
  //TODO - mix active players
  db.players.find({}).sort({scores:1}).limit(20).exec((err, players) => {
    socket.emit('action', {type:'top20players', data:players});
  })
}

const syncAllPlayers = socket => {
  db.players.find({}).sort({scores:1}).exec((err, players)=>{
    socket.emit('action', {type:'all_players', data:players});
  });
}

io.on('connection', socket => {

  socket.on('action', action => {

    console.log(action);

    socket.emit('action', {type:'colors', data:config.colors});

    switch (action.type){
      case 'server/active_players':
        syncActivePlayers(socket);
        break;
      case 'server/free_colors':
        syncFreeColors(socket);
        break;
      case 'server/top20players':
        syncTop20(socket);
        break;
      case 'server/all_players':
        syncAllPlayers(socket);
        break;
      case 'server/add_player':
        db.players.insert({scores:0, ...action.data}, (err, newPlayer) => {
          if(!err){
            syncTop20(io);
            syncFreeColors(io);
            syncActivePlayers(io);
          }
        })
        break;
      case 'server/remove_player':
        db.players.remove({colorId: action.data}, err => {
          if(!err){
            syncActivePlayers(socket);
            syncFreeColors(socket);
          }
        });
        break;
      case 'server/clear':
        db.players.remove({}, {multi:true}, err => {
          if(!err){
            syncAllPlayers(socket);
          }
        })
    }
  });
});