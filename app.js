import to from 'await-to-js';
const http = require('http');
const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;

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

app.use(express.static(__dirname + '/'));

app.get(/.*/, function root(req, res) {
  res.sendFile(__dirname + '/index.html');
});


(async () => {
  // READ CONFIGS
  const config  = require('./config');
  console.log(config);

  // Connection URL
  const { db: dbconfig } = config;

  let mongoclient = new MongoClient(new Server(dbconfig.address, dbconfig.port), { native_parser: true });
  mongoclient = await mongoclient.connect();

  const db = mongoclient.db(dbconfig.name);

  const collections = {
    players: db.collection('players'),
    settings: db.collection('settings')
  };


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

  // process sockets messages
  io.on('connection', socket => {
    console.log('connection');

    socket.on('action', async (action) => {
      switch (action.type) {
        case 'server/add_player':
          {
            const [errCount, playersCount] = await to(collections.players.countDocuments({}));
            if (errCount) {
              console.log(errCount);

              return;
            }
            const code = playersCount + 1;
            const userData = { ...action.data, code };

            const [errInsert] = await to(collections.players.insertOne(userData));
            if (errInsert) {
              console.log(errInsert);

              return;
            }

            io.sockets.emit('action', { type: 'player_added', data: userData })
          }
          break;
        case 'server/find_player':
          {
            const { broughtNotebook, updateBroughtNotebook, ...data } = action.data;

            const [findErr, player] = await to(collections.players.findOne(data));
            if (findErr) {
              console.log(findErr);
              console.log(`Player with ${Object.keys(data).join(' and ')} is not found`);
              return;
            }

            if (!player) {
              socket.emit('action', { type: 'found_player', data: { ...data, code: -1 } });
              return;
            }

            if (updateBroughtNotebook) {
              const [updateErr] = await to(collections.players.updateOne({ ...data }, { $set: { broughtNotebook } }));
              if (updateErr) {
                console.log(updateErr);
                return;
              }
              io.sockets.emit('action', { type: 'player_updated', data: {...player, broughtNotebook} })
            }

            socket.emit('action', { type: 'found_player', data: {...player, broughtNotebook} })
          }
          break;
        case 'server/update_player':
          {
            const { code, ...data } = action.data;

            const [findErr, player] = await to(collections.players.findOne({ code }));
            if (findErr) {
              console.log(findErr);
              console.log(`Player with ID ${code} is not found`);
              return;
            }

            const [updateErr] = await to(collections.players.updateOne({ code }, { $set: data }));
            if (updateErr) {
              console.log(updateErr);
              return;
            }

            io.sockets.emit('action', { type: 'player_updated', data: { ...player, ...data } })
          }
          break;
        case 'server/set_tournament_number':
          {
            const tournamentNumber = action.data;

            const [updateErr] = await to(collections.settings.replaceOne({
              type: 'tournamentNumber'
            }, {
              type: 'tournamentNumber',
              value: tournamentNumber
            }, { upsert: true }));

            if (updateErr) {
              console.log(updateErr);
              return;
            }

            io.sockets.emit('action', { type: 'tournament_number', data: tournamentNumber })
          }
          break;
        case 'server/get_tournament_number':
          {
            const [findErr, tournament] = await to(collections.settings.findOne({
              type: 'tournamentNumber'
            }));

            if (findErr) {
              console.log(findErr);
              return;
            }

            const { value: tournament_number } = tournament;

            socket.emit('action', { type: 'tournament_number', data: tournament_number })
          }
          break;
        case 'server/get_players_count':
          {
            const [countErr, playersCount] = await to(collections.players.countDocuments({}));
            if (countErr) {
              console.log(countErr);
              return;
            }

            io.sockets.emit('action', { type: 'players_count', data: playersCount })
          }
          break;
        case 'server/get_players':
          {
            const { filter } = action.data;
            const { page, rowsCount } = filter;

            const [ findError, players ] = await to(
              collections.players.find({ code: { $gt: page*rowsCount }}).limit(rowsCount).toArray()
            );

            if (findError) {
              console.log(findError);
              return;
            }

            socket.emit('action', { type: 'players', data: players })
          }
          break;
        case 'server/get_top_players':
          {
            const { filter } = action.data;
            const { page, rowsCount } = filter;

            const [ findError, players ] = await to(
              collections.players.find({ broughtNotebook: true }).sort({scores: -1}).skip(page*rowsCount).limit(rowsCount).toArray()
            );

            if (findError) {
              console.log(findError);
              return;
            }

            socket.emit('action', { type: 'players', data: players });
          }
          break;
        case 'server/get_top_players_count':
          {
            const [countErr, playersCount] = await to(collections.players.countDocuments({ broughtNotebook: true }));
            if (countErr) {
              console.log(countErr);
              return;
            }

            io.sockets.emit('action', { type: 'top_players_count', data: playersCount })
          }
          break;
        case 'server/add_scores':
          {
            const { code, scores: additionalScores } = action.data;

            const [findErr, player] = await to(collections.players.findOne({ code }));
            if (findErr) {
              console.log(findErr);
              console.log(`Player with ID ${code} is not found`);
              return;
            }

            const scores = additionalScores + (player.scores || 0);

            const [updateErr] = await to(
              collections.players.updateOne({
                code
              }, {
                $set: {
                  scores
                }
              })
            );

            if (updateErr) {
              console.log(updateErr);
              return;
            }

            io.sockets.emit('action', { type: 'player_updated', data: { ...player, scores } })
          }
          break;
        case 'server/reset_scores':
          {
            const [updateErr] = await to(
              collections.players.updateMany({}, {
                $set: {
                  scores: 0
                }
              })
            );

            if (updateErr) {
              console.log(updateErr);
              return;
            }

            io.sockets.emit('action', { type: 'players_update_ts', data: +(new Date()) })
          }
          break;
      }
    });
  });
})();
