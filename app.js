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
  const { readers, registrationPoints, activities } = config;


  const updateTop = async (socket=io.sockets) => {
    const [errTop, top10] = await to(collections.players.find({}).sort({spend: -1}).limit(10).toArray());
    if (errTop) {
      console.error('Error occurred in try of update top');
      console.log(errTop);
      return;
    }
    socket.emit('action', { type: 'topten', data: top10 });
  };

  const updateRegistrationPoints = (socket=io.sockets) => {
    socket.emit('action', { type: 'registrationPoints', data: registrationPoints });
  };
  const resetRegistrationPoint = (registrationPoint) => {
    setTimeout(() => {
      delete registrationPoint.error;
      delete registrationPoint.registered;
      delete registrationPoint.player;

      updateRegistrationPoints();
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
          updateRegistrationPoints();
          setTimeout(() => {
            delete registrationPoint.error;
            updateRegistrationPoints();
          }, 5000);

          return;
        }

        if (playersCount > 0) {
          registrationPoint.error = 'rfidInUse';
          updateRegistrationPoints();
          setTimeout(() => {
            delete registrationPoint.error;
            updateRegistrationPoints();
          }, 5000);

          return;
        }

        const { startBalance } = config;
        const [errInsert] = await to(collections.players.insertOne({
          ...player, rfid, spend: 0, balance: startBalance, startBalance
        }));

        if (errInsert) {
          registrationPoint.error = true;
          updateRegistrationPoints();
          setTimeout(() => {
            delete registrationPoint.error;
            updateRegistrationPoints();
          }, 5000);

          return;
        }

        console.log('done');
        registrationPoint.registered = true;

        updateTop();
        updateRegistrationPoints();
        resetRegistrationPoint(registrationPoint);
      }
    });
  };


  const updateActivities = (socket) => {
    (socket || io.sockets).emit('action', { type: 'activities', data: activities });
  };
  const resetActivity = (activity) => {
    setTimeout(() => {
      delete activity.error;
      delete activity.player;
      delete activity.selected;

      updateActivities();
    }, 4000);
  };

  const checkActivities = (readerId, rfid) => {
    console.log(`checkActivities ${[readerId, rfid].join(', ')}`);
    Object.keys(activities).forEach(async (activityId) => {
      const activity = activities[activityId];
      const { selected, balanceChecking } = activity;

      if (activity.readerId === readerId && (selected || balanceChecking)) {

        // find player by rfid
        const [errFind, player] = await to(collections.players.findOne({ rfid }));
        if (errFind) {
          activity.error = true;
          updateActivities();
          resetActivity(activity);

          return;
        }

        if (!player) {
          activity.error = 'rfidInActive';
          updateActivities();
          resetActivity(activity);

          return;
        }

        if (balanceChecking) {
          activity.player = player;
          updateActivities();
          resetActivity(activity);
        } else {
          const { price } = selected;
          const { spend, balance } = player;
          let state = { spend, balance };

          if (balance > 0) {
            const date = +new Date();
            if (activity.delay && activity.lastUsageDate) {
              if (date - activity.lastUsageDate < activity.delay*1000*60) {
                activity.error = 'tooOften';
                updateActivities();
                resetActivity(activity);

                return;
              }
            }

            activity.lastUsageDate = date;

            state = {
              spend: spend + price,
              balance: balance - price
            };

            const [errUpdate] = await to(collections.players.updateOne({ rfid }, {
              $set: { ...state }
            }));

            if (errUpdate) {
              activity.error = true;
              updateActivities();
              resetActivity(activity);

              return;
            }

            updateTop();
          }

          activity.player = {...player, ...state};

          updateActivities();
          resetActivity(activity);
        }
      }
    });
  };


  // RFID READERS
  const rfidReaderEvent = (readerId, rfid) => {
    const reader = readers.find(reader => reader.outerId === readerId);
    if (reader) {
      checkRegistrationPoints(reader.id, rfid);
      checkActivities(reader.id, rfid);
    } else {
      console.error(`Reader with id: ${readerId} is not defined in readers of config.js file`);
    }
  };


  // process sockets messages
  io.on('connection', (socket) => {
    console.log('connection');

    socket.emit('action', { type: 'currency', data: config.currency });
    socket.emit('action', { type: 'allSpendMessage', data: config.allSpendMessage });
    socket.emit('action', { type: 'denyMessage', data: config.denyMessage });

    updateRegistrationPoints(socket);
    updateActivities(socket);
    updateTop(socket);

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
        case 'server/update_player':
          {
            const { rfid, ...data } = action.data;

            const [findErr, player] = await to(collections.players.findOne({ rfid }));
            if (findErr) {
              console.log(findErr);
              console.log(`Player with RFID ${rfid} is not found`);
              return;
            }

            const [updateErr] = await to(collections.players.updateOne({ rfid }, { $set: data }));
            if (updateErr) {
              console.log(updateErr);
              return;
            }
            updateTop();
            io.sockets.emit('action', { type: 'player_updated', data: { ...player, ...data } })
          }
          break;
        case 'server/delete_player':
          {
            const { rfid } = action.data;

            const [findErr] = await to(collections.players.removeOne({ rfid }));
            if (findErr) {
              console.log(findErr);
              console.log(`Player with RFID ${rfid} is not found`);
              return;
            }
            updateTop();
            io.sockets.emit('action', { type: 'players_update_ts', data: +(new Date()) })
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
              collections.players.find({}).sort({ scores: -1 }).skip(page*rowsCount).limit(rowsCount).toArray()
            );

            if (findError) {
              console.log(findError);
              return;
            }

            socket.emit('action', { type: 'players', data: players })
          }
          break;
      }
    });
  });

  app.use(express.static(__dirname + '/'));

  app.get('/reader/:readerId/:rfid', function(req, res) {
    const { readerId, rfid } = req.params;

    rfidReaderEvent(readerId*1, rfid*1);
    res.send(`reader ${readerId} sent ${rfid} rfid`);
  });

  app.get(/.*/, function root(req, res) {
    res.sendFile(__dirname + '/index.html');
  });
})();
