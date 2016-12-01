const http = require('http');
const express = require('express');
const app = express();

const Datastore = require('nedb');

const db = {
  lastplayernum: new Datastore({filename:'db/lastplayernum', autoload:true }),
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

let updatedPlayers = [];
let updateio = () => {};
app.get('/api/gameover', (req, res) => {
  const { num, scores, time } = req.query;
  //find and remember last state of player (we need colorId)
  db.players.findOne({num:+num}, (err, player) => {
    if(!err && player){

      const nextPlayerState = {scores:+scores, time:+time, colorId:0};

      updatedPlayers.push({...player, scores:+scores, time:+time});
      console.log(updatedPlayers);
      setTimeout(() => {
        updatedPlayers = updatedPlayers.filter(updatedPlayer => updatedPlayer._id != player._id);
        console.log(updatedPlayers);
        updateio();
      }, config.highlighted_delay*1 || 5000);

      //update state of player
      db.players.update({num:+num}, {$set:nextPlayerState}, err => {
        if(!err){
          //get position in global scoreboard
          db.players.find({}).sort({scores:-1}).exec((err, players) => {
            if(!err){
              
              const place = players.findIndex(player => {
                return +player.num === +num;
              });
              
              res.send({Status:'ok', Place:place+1});
              
              updateio();
              
            }
          })
        }
      })
    }
  });
});

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
  db.players.find({colorId: {$gt:0}}).exec((err, players) => {
    console.log(players);
    socket.emit('action', {type:'active_players', data:players});
  });
}

const syncFreeColors = socket => {
  db.players.find({colorId: {$gt:0}}).exec((err, players) => {

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

  const limit = 20;

  // console.log(updatedPlayers)
  const updatedPlayersIds = updatedPlayers.map(player => player._id);
  // console.log(updatedPlayersIds);
  //TODO - mix active players
  db.players.find({}).sort({scores:-1}).limit(limit).exec((err, players) => {

    // console.log(players); 
    //remove changed from result
    players = players.filter(player => updatedPlayersIds.indexOf(player._id) < 0);
    const countintail = updatedPlayersIds.length - (limit-players.length);
    // console.log(players);
    players = players.slice(0, limit-countintail);
    //add changed and sort by scores
    players = players.concat(updatedPlayers)
      .sort((pA, pB) => {
        if(+pA.scores < +pB.scores){
          return 1;
        }else if(+pA.scores > +pB.scores){
          return -1;
        }else{
          if(+pA.num > +pB.num){
            return 1;
          }else if(+pA.num < +pB.num){
            return -1;
          }else{
            return 0;
          }
        }
      })
    console.log('res length: '+players.length);
    // const overflow = players.length-limit;

    // players = players.slice(0, limit);
    // console.log(players);

    socket.emit('action', {type:'top20players', data:players});
  })
}

const syncAllPlayers = socket => {
  db.players.find({}).sort({scores:-1}).exec((err, players)=>{
    socket.emit('action', {type:'all_players', data:players});
  });
}

const getNextNum = (cb) => {
  db.lastplayernum.findOne({}, (err, lastplayernum) => {

    const nextnum = lastplayernum?(lastplayernum.num+1):1;

    db.lastplayernum.update({}, {num:nextnum}, {upsert:true}, err => {
      if(!err){
        cb && cb(nextnum);
      }
    });
  })
}

updateio = () => {
  syncTop20(io);
  syncActivePlayers(io);
  syncFreeColors(io);
  syncAllPlayers(io);
}

io.on('connection', socket => {

  socket.on('action', action => {

    console.log(action);

    socket.emit('action', {type:'colors', data:config.colors});
    socket.emit('action', {type:'screensaver_params', data:config.screensaver_params});

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
        getNextNum(nextNum => {
          db.players.insert({scores:0, num:nextNum, ...action.data}, (err, newPlayer) => {
            if(!err){
              syncActivePlayers(io);
              syncFreeColors(io);
              syncTop20(io);
            }
          })
        })
        break;
      case 'server/remove_player':
        db.players.remove({num: action.data}, err => {
          if(!err){
            syncActivePlayers(io);
            syncFreeColors(io);
            syncTop20(io);

          }
        });
        break;
      case 'server/clear':
        db.players.remove({}, {multi:true}, err => {
          if(!err){
            syncActivePlayers(io);
            syncFreeColors(io);
            syncTop20(io);
            syncAllPlayers(io);
          }
        })
    }
  });
});