var express = require('express');
var router = express.Router();

const Channel = require('../lib/Blockchain/Channel');
const Transaction = require('../lib/Blockchain/Transaction');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

module.exports = router;
