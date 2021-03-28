var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const client = require("socket.io-client");
const BlockchainLib = require('./lib/Blockchain/Blockchain');

var indexRouter = require('./api/index');
var usersRouter = require('./api/users');
var blockchainRouter = require('./api/blockcain');
// var walletRouter = require('./api/wallet');
var videosRouter = require('./api/videos');
var channelsRouter = require('./api/channels');

var app = express();
const socket = client('http://localhost:3000');
// socket.on("connect", () => {
//   console.log("connect to the peer server")
// })
// socket.on("Blockchain:newTransaction", () => {
//   console.log("new Transaction from the peer server")
// })

let BlockchainHandler = require('./lib/network/BlockchainHandler');
BlockchainHandler(socket)

let blochchain = new BlockchainLib();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const passSocket = function(req, res, next) {
  req.socket = socket;
  next();
}

const passBlockchain = function(req, res, next) {
  req.blochchain = blochchain;
  next();
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blockchain', passSocket, passBlockchain, blockchainRouter);
// app.use('/wallet', walletRouter);
app.use('/videos', passBlockchain, videosRouter);
app.use('/channels', passSocket, channelsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
