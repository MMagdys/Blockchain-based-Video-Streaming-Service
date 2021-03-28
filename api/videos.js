var express = require('express');
var router = express.Router();
// const VideosLib = require('../lib/Videos/Videos');

const MetaData = require('../lib/Blockchain/MetaData');
const Transaction = require('../lib/Blockchain/Transaction');
const {sign} = require('../lib/crypto/Elliptic')


// router.get('/', function(req, res, next) {
//   let blochchain = req.blochchain
//   VideosLib.myLibrary(blochchain)
//   .then((records) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({records: records});
//   })
// });


router.post('/addContent', function(req, res, next) {

  // create new channel
  let amount = req.body.amount ? req.body.amount : 0
  let metaData = new MetaData(req.body.mediaName, req.body.streamHash, amount);

  let trans = new Transaction();
  let sig = sign(metaData.hash, req.body.channelPrivateKey)
  trans.AddContent(metaData, req.body.channelUsername, sig);

  let socket = req.socket
  socket.emit("Blockchain:newTransaction", trans);
  
  res.json(metaData);
});

module.exports = router;