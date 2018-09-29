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
    players: db.collection('players')
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
      console.log(action);
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

            socket.emit('action', { type: 'player_added', data: userData })
          }
          break;
        case 'server/find_player':
          {
            const { email, broughtNotebook} = action.data;

            const [findErr, player] = await to(collections.players.findOne({ email }));
            if (findErr || !player) {
              console.log(findErr);
              console.log(`Player with ${email} is not found`);
              return;
            }

            const [updateErr] = await to(collections.players.updateOne({ email }, { $set: { broughtNotebook } }));
            if (updateErr) {
              console.log(updateErr);
              return;
            }

            socket.emit('action', { type: 'found_player', data: {...player, broughtNotebook} })
          }
          break;
        case 'server/top10players':
          break;
        case 'server/all_players':
          break;
        case 'server/remove_player':
          break;
        case 'server/clear':
          break;
      }
    });
  });
})();
