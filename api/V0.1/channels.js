var express = require('express');
var router = express.Router();
var cors = require('./cors');

const Channel = require('../../lib/Blockchain/Channel');
const Transaction = require('../../lib/Blockchain/Transaction');
const channelService = require('../../services/channel/channelService');


router.options('*', cors.corsWithOptions)


router.post('/createChannel', function(req, res, next) {
  
    // create new channel
    let amount = req.body.amount ? req.body.amount : 0
    let myChannel = new Channel(req.body.channelId, req.body.name, req.body.type, amount, req.body.publicKey);
  
    let trans = new Transaction();
    trans.createChannel(myChannel);
  
    let socket = req.socket
    socket.emit("Blockchain:newTransaction", trans);
  
    res.setHeader('Content-Type', 'application/json');
    res.json(trans);
});


router.post('/', function(req, res, next) {
  
  let contentTrie = req.contentTrie

  channelService.getChannelInfo(contentTrie, req.body.channelId)
  .then((channelInfo) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.json(channelInfo);
  })

});


router.get('/subscribtion', function(req, res, next) {
  
  channelService.getAllSubscriptions(req.body.channelId)
  .then((channel) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.json(channel);
  })
  .catch((err) => {
    res.statusCode = 500;
    res.json(err)
})

});


router.post('/subscribe', function(req, res, next) {
  
  channelService.subscrieToChannel(req.body.channelId)
  .then((channel) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.json(channel);
  })
  .catch((err) => {
    res.statusCode = 500;
    res.json(err)
  })
});


router.post('/unsubscribe', function(req, res, next) {
  
  channelService.unSubscrieToChannel(req.body.channelId)
  .then((channel) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.json(channel);
  })
  .catch((err) => {
    res.statusCode = 500;
    res.json(err)
  })
});


router.post('/login', function(req, res, next) {
  
  let contentTrie = req.contentTrie
  channelService.login(contentTrie, req.body)
  .then((channel) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.json(channel);
  })
  .catch((err) => {
    res.statusCode = 500;
    res.json(err)
  })
});

module.exports = router;
