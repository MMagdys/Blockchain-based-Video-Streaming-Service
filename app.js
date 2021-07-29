var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const client = require("socket.io-client");
const Blockchain = require('./lib/Blockchain/Blockchain');
const PatriciaTrie = require('./lib/Blockchain/PatriciaTrie')

var indexRouter = require('./api/V0.1/index');
var usersRouter = require('./api/V0.1/users');
var blockchainRouter = require('./api/V0.1/blockcain');
// var walletRouter = require('./api/wallet');
var videosRouter = require('./api/V0.1/videos');
var channelsRouter = require('./api/V0.1/channels');

var app = express();
// const socket = client('http://localhost:4000');
const socket = client('http://18.193.46.139/', {path: '/socket.io/'}, );
// socket.on("connect", () => {
//   console.log("connect to the peer server")
// })
// socket.on("Blockchain:newTransaction", () => {
//   console.log("new Transaction from the peer server")
// })
let blochchain = new Blockchain();
let contentTrie = new PatriciaTrie();

let BlockchainHandler = require('./lib/network/BlockchainHandler');
BlockchainHandler(socket, blochchain, contentTrie)


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

const passContentTrie = function(req, res, next) {
  req.contentTrie = contentTrie;
  next();
}

let V0 = express.Router();

V0.use('/', indexRouter);
V0.use('/users', usersRouter);
V0.use('/blockchain', passBlockchain, passSocket, blockchainRouter);
// app.use('/wallet', walletRouter);
V0.use('/videos', passBlockchain, passSocket, passContentTrie, videosRouter);
V0.use('/channels', passSocket, passContentTrie, channelsRouter);

app.use('/v0', V0);

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
