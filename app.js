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

  // SETUP
  const { registrationPoints, activities } = config;

  const updateRegistrationPoint = () => {
    io.sockets.emit('action', { type: 'registrationPoints', data: registrationPoints });
  };
  const resetRegistrationPoint = (registrationPoint) => {
    setTimeout(() => {
      delete registrationPoint.error;
      delete registrationPoint.registered;
      delete registrationPoint.player;

      updateRegistrationPoint();
    }, 3000);
  };

  const checkRegistrationPoints = (readerId, rfid) => {
    // scan registrationPoints
    Object.keys(registrationPoints).forEach(async (pointId) => {
      const registrationPoint = registrationPoints[pointId];

      // save new players
      if (registrationPoint.readerId === readerId && registrationPoint.player) {
        const { player } = registrationPoint;

        const [errCount, playersCount] = await to(collections.players.countDocuments({ rfid }));
        if (errCount) {
          registrationPoint.error = true;
          updateRegistrationPoint();
          setTimeout(() => {
            delete registrationPoint.error;
            updateRegistrationPoint();
          }, 5000);

          return;
        }

        if (playersCount > 0) {
          registrationPoint.error = 'rfidInUse';
          updateRegistrationPoint();
          setTimeout(() => {
            delete registrationPoint.error;
            updateRegistrationPoint();
          }, 5000);

          return;
        }

        const { startBalance } = config;
        const [errInsert] = await to(collections.players.insertOne({
          ...player, rfid, spend: 0, balance: startBalance, startBalance
        }));

        if (errInsert) {
          registrationPoint.error = true;
          updateRegistrationPoint();
          setTimeout(() => {
            delete registrationPoint.error;
            updateRegistrationPoint();
          }, 5000);

          return;
        }
        console.log('done');
        registrationPoint.registered = true;

        updateRegistrationPoint();
        resetRegistrationPoint(registrationPoint);
      }
    });
  };


  const updateActivity = () => {
    io.sockets.emit('action', { type: 'activities', data: activities });
  };
  const resetActivity = (activity) => {
    setTimeout(() => {
      delete activity.error;
      delete activity.player;

      updateActivity();
    }, 4000);
  };

  const checkActivities = (readerId, rfid) => {
    console.log(`checkActivities ${[readerId, rfid].join(', ')}`);
    Object.keys(activities).forEach(async (activityId) => {
      const activity = activities[activityId];
      const { selected, balanceChecking } = activity;

      if (activity.readerId === readerId && (selected || balanceChecking)) {
        console.log(activity);

        // find player by rfid
        const [errFind, player] = await to(collections.players.findOne({ rfid }));
        if (errFind) {
          activity.error = true;
          updateActivity();
          resetActivity(activity);

          return;
        }

        if (!player) {
          activity.error = 'rfidInActive';
          updateActivity();
          resetActivity(activity);

          return;
        }

        if (balanceChecking) {
          activity.player = player;
          updateActivity();
          resetActivity(activity);
        } else {
          const date = +new Date();
          if (activity.delay && activity.lastUsageDate) {
            if (date - activity.lastUsageDate < activity.delay*1000*60) {
              activity.error = 'tooOften';
              updateActivity();
              resetActivity(activity);

              return;
            }
          }

          console.log('player');
          console.log(player);

          // update player state
          const { price } = selected;
          const { spend, balance } = player;
          let state = { spend, balance };

          if (balance >= price) {
            state = {
              spend: spend + price,
              balance: balance - price
            };

            console.log('state');
            console.log(state);
            const [errUpdate, result] = await to(collections.players.updateOne({ rfid }, {
              $set: { ...state }
            }));

            console.log('result');
            console.log(result);

            if (errUpdate) {
              activity.error = true;
              updateActivity();
              resetActivity(activity);

              return;
            }
          }

          activity.lastUsageDate = date;
          activity.player = {...player, ...state};

          updateActivity();
          resetActivity(activity);
        }
      }
    });
  };


  // RFID READERS
  const rfidReaderEvent = (readerId, rfid) => {
    checkRegistrationPoints(readerId, rfid);
    checkActivities(readerId, rfid);
  };


  // process sockets messages
  io.on('connection', (socket) => {
    console.log('connection');

    socket.emit('action', { type: 'registrationPoints', data: registrationPoints });
    socket.emit('action', { type: 'activities', data: activities });
    socket.emit('action', { type: 'currency', data: config.currency });
    socket.emit('action', { type: 'allSpendMessage', data: config.allSpendMessage });
    socket.emit('action', { type: 'denyMessage', data: config.denyMessage });

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
        case 'server/variant_selected':
          {
            const { activityId, variant } = action.data;
            activities[activityId].selected = variant;
            socket.emit('action', { type: 'activities', data: activities });
          }
          break;

        case 'server/variant_unselect':
          {
            const activityId = action.data;
            delete activities[activityId].selected;
            socket.emit('action', { type: 'activities', data: activities });
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

  app.get('/reader/:id/:rfid', function(req, res) {
    const { id, rfid } = req.params;
    rfidReaderEvent(id*1, rfid*1);
    res.send(`reader ${id} sent ${rfid} rfid`);
  });

  app.get(/.*/, function root(req, res) {
    res.sendFile(__dirname + '/index.html');
  });
})();
