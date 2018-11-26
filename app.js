import to from 'await-to-js';
const http = require('http');
const express = require('express');
const app = express();
const Datastore = require('nedb');


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

  // SETUP
  const playersStore = new Datastore({ filename: './db/players', autoload: true });
  const { readers, registrationPoints, activities } = config;


  // process sockets messages
  io.on('connection', (socket) => {
    console.log('connection');

    socket.emit('action', { type: 'registrationPoints', data: registrationPoints });
    socket.emit('action', { type: 'activities', data: activities });

    socket.on('action', async (action) => {
      console.log(action);
      switch (action.type) {
        case 'server/registration_point_update':
          {
            const { id, payload } = action.data;
            registrationPoints[id] = { ...registrationPoints[id], ...payload };

            socket.emit('action', { type: 'registrationPoints', data: registrationPoints });
          }
          break;
        /*
        case 'server/find_player':
          {
            const { broughtNotebook, updateBroughtNotebook, ...data } = action.data;

            const [findErr, player] = await to(playersStore.findOne(data));
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
              const [updateErr] = await to(playersStore.updateOne({ ...data }, { $set: { broughtNotebook } }));
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

            const [findErr, player] = await to(playersStore.findOne({ code }));
            if (findErr) {
              console.log(findErr);
              console.log(`Player with ID ${code} is not found`);
              return;
            }

            const [updateErr] = await to(playersStore.updateOne({ code }, { $set: data }));
            if (updateErr) {
              console.log(updateErr);
              return;
            }

            io.sockets.emit('action', { type: 'player_updated', data: { ...player, ...data } })
          }
          break;
        case 'server/delete_player':
          {
            const { code } = action.data;

            const [findErr] = await to(playersStore.removeOne({ code }));
            if (findErr) {
              console.log(findErr);
              console.log(`Player with ID ${code} is not found`);
              return;
            }

            io.sockets.emit('action', { type: 'players_update_ts', data: +(new Date()) })
          }
          break;
        case 'server/get_players_count':
          {
            const [countErr, playersCount] = await to(playersStore.countDocuments({}));
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
              playersStore.find({}).sort({ scores: -1 }).skip(page*rowsCount).limit(rowsCount).toArray()
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
              playersStore.find({ broughtNotebook: true, scores: { $gt: 0 } }).sort({ scores: -1 }).skip(page*rowsCount).limit(rowsCount).toArray()
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
            const [countErr, playersCount] = await to(playersStore.countDocuments({ broughtNotebook: true, scores: { $gt: 0 } }));
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

            const [findPlayerErr, player] = await to(playersStore.findOne({ code }));
            if (findPlayerErr) {
              console.log(findPlayerErr);
              console.log(`Player with ID ${code} is not found`);
              return;
            }

            const scores = additionalScores + (player.scores || 0);

            const [updateErr] = await to(
              collections.players.updateOne({
                code
              }, {
                $set: {
                  scores: scores > scoresLimit ? scoresLimit : scores,
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
        */
      }
    });
  });

  app.use(express.static(__dirname + '/'));

  app.get(/.*/, function root(req, res) {
    res.sendFile(__dirname + '/index.html');
  });
})();
