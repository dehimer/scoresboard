import to from 'await-to-js';
const http = require('http');
const express = require('express');
const app = express();

// RUN WEBPACK HOT LOADER
if(process.env.npm_lifecycle_event === 'dev'){
  (function initWebpack() {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack/common.config');
    const compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true, publicPath: webpackConfig.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler, {
      log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
  })();
}

(async () => {
  // READ CONFIGS
  const config  = require('./config');
  console.log(config);

  // SETUP DB
  const MongoClient = require('mongodb').MongoClient;
  const Server = require('mongodb').Server;

  // Connection URL
  const { db: dbconfig } = config;
  // const url = `mongodb://${dbconfig.address}/${dbconfig.name}`;

  // Use connect method to connect to the server
  // const db = await MongoClient.connect(url, { useNewUrlParser: true });

  let mongoclient = new MongoClient(new Server(dbconfig.address, dbconfig.port), {native_parser: true});
  mongoclient = await mongoclient.connect();
  const db = mongoclient.db(dbconfig.name);

  const collections = {
    lastplayernum: db.collection('lastplayernum'),
    players: db.collection('players')
  };

  // PROCESS HTTP REQUESTS
  let updatedPlayers = [];
  let updateio = () => {};
  // process messages from players
  app.get('/api/gameover', async (req, res) => {
    const { num: colorId, scores, time } = req.query;

    //find and remember last state of player (we need colorId)
    const [err, player]= await to(collections.players.findOne({ colorId: +colorId }));
    if (err || !player) {
      console.log(`player with ${colorId} is not found`);
      res.send({Status: 'error'});
      return;
    }

    const playerId = player._id;
    const nextPlayerState = { scores: +scores, time: +time, colorId: 0 };

    updatedPlayers.push({ ...player, scores: +scores, time: +time });

    setTimeout(() => {
      updatedPlayers = updatedPlayers.filter(updatedPlayer => updatedPlayer._id !== player._id);
      updateio();
    }, config.highlighted_delay || 5000);

    //update state of player
    const [updateErr] = await to(collections.players.update({ _id: playerId }, { $set: nextPlayerState }));
    if (updateErr) {
      console.log(updateErr);
      return;
    }

    //get position in global scoreboard
    const [findErr, players] = await to(collections.players.find({}).sort({ scores: -1 }).toArray());
    if (findErr) {
      console.log(findErr);
      return;
    }

    const place = players.findIndex(player => {
      return player._id === playerId;
    });

    res.send({ Status: 'ok', Place: place + 1 });

    updateio();
  });

  app.use(express.static(__dirname + '/'));

  app.get(/.*/, function root(req, res) {
    res.sendFile(__dirname + '/index.html');
  });
  // if(process.env.npm_lifecycle_event == 'dev'){
  // }else{
  //   app.use(express.static(__dirname + '/'));
  // }


  // STARTUP SERVERS
  // run http server
  const server = http.createServer(app);
  server.listen(process.env.PORT || 3000, function onListen() {
    const address = server.address();
    console.log('Listening on: %j', address);
    console.log(' -> that probably means: http://localhost:%d', address.port);
  });

  // run socket server
  var socket_io = require('socket.io');
  var io = socket_io();
  io.attach(server);


  // METHODS TO PROCESS SOCKETS MESSAGES
  // send to all socket clients new array with active players (who have color)
  const syncActivePlayers = async (socket) => {
    const [err, players] = await to(collections.players.find({ colorId: { $gt: 0 } }).toArray());
    if (err) {
      console.log(err);
      return;
    }

    socket.emit('action', { type: 'active_players', data: players });
  };

  // send to all socket clients array of available to select colors
  const syncFreeColors = async (socket) => {
    const [err, players] = await to(collections.players.find({ colorId: { $gt: 0 }}).toArray());
    if (err) {
      console.log(err);
      return;
    }

    // free colors
    const busyColors = players.reduce((colors, player) => {
      colors[player.colorId] = true;
      return colors;
    }, {});

    const freeColors = config.colors.filter(color => {
      return !busyColors[color.id];
    });
    socket.emit('action', { type: 'free_colors', data: freeColors });
  };

  // update by socket the list of top 20 players
  const syncTop20 = async (socket) => {
    const limit = 20;

    const updatedPlayersIds = updatedPlayers.map(player => player._id);

    let [err, players] = await to(collections.players.find({}).sort({ scores: -1 }).limit(limit).toArray());
    if (err) {
      console.log(err);
      return;
    }
    console.log(players);

    // remove changed from result
    players = players.filter(player => updatedPlayersIds.indexOf(player._id) < 0);
    const countintail = updatedPlayersIds.length - (limit-players.length);

    players = players.slice(0, limit - countintail);
    // add changed and sort by scores
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
      });

    socket.emit('action', { type: 'top20players', data: players });
  };

  // send list of all players to all players list page
  const syncAllPlayers = async (socket) => {
    const [err, players] = await to(db.players.find({}).sort({scores:-1}).toArray());
    if (err) {
      console.log(err);
      return;
    }

    socket.emit('action', { type: 'all_players', data: players });
  };

  // return next num of new player (imitation of autoincrements)
  const getNextNum = async (cb) => {
    // get current record of lastplayernum collection from db
    const [findErr, lastplayernum] = await to(collections.lastplayernum.findOne({}));
    if (findErr) {
      console.log(findErr);
      return;
    }

    const nextnum = lastplayernum ? (lastplayernum.num+1) : 1;

    const [updateErr] = await to(collections.lastplayernum.update({}, { num: nextnum }, { upsert: true }));
    if(!updateErr){
      cb && cb(nextnum);
    }
  };

  // triggered when /api/gameover request is processed
  // for notice all socket clients about new state
  updateio = () => {
    syncTop20(io);
    syncActivePlayers(io);
    syncFreeColors(io);
    syncAllPlayers(io);
  };

  // process sockets messages
  io.on('connection', socket => {
    console.log('connection');

    socket.emit('action', { type: 'colors', data: config.colors });
    socket.emit('action', { type: 'screensaver_params', data: config.screensaver_params });

    socket.on('action', async (action) => {
      console.log(action);
      switch (action.type) {
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
          getNextNum(async (nextNum) => {
            const [err] = await to(collections.players.insertOne({ scores: 0, num: nextNum, ...action.data }));

            if(!err){
              syncActivePlayers(io);
              syncFreeColors(io);
              syncTop20(io);
            }
          });
          break;
        case 'server/remove_player':
          {
            const [err] = await to(collections.players.removeOne({ num: action.data }));
            if(!err){
              syncActivePlayers(io);
              syncFreeColors(io);
              syncTop20(io);
            }
          }

          break;
        case 'server/clear':
          {
            const [err] = await to(collections.players.removeMany({}, { multi: true }));
            if(!err){
              syncActivePlayers(io);
              syncFreeColors(io);
              syncTop20(io);
              syncAllPlayers(io);
            }
          }
          break;
      }
    });
  });
})();
