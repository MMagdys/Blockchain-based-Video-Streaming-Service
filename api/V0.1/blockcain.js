var express = require('express');
var router = express.Router();
var cors = require('./cors');

// const Blockchain = require('../lib/Blockchain/Blockchain');
const Block = require('../../lib/Blockchain/Block');
// const PatriciaTrie = require('../lib/Blockchain/PatriciaTrie');

// GLOBAL CONSTANTS
// let CONTENTTREE = new PatriciaTrie()
// let myBlockchain = new Blockchain()

router.options('*', cors.corsWithOptions)

router.get('/', cors.corsWithOptions, function(req, res, next) {

  let myBlockchain = req.blochchain
  let socket = req.socket
  socket.emit("Blockchain:blockchain",  (response) => {
    myBlockchain.blocks = response.blocks
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.json(response.blocks);
  })
});


router.get('/blocks', function(req, res, next) {

  let socket = req.socket
  socket.emit("Blockchain:blocks",  (response) => {
    // console.log(response);
    res.setHeader('Content-Type', 'application/json');
    res.json(response.blocksHeader);
  })
});


router.get('/validTransactions', function(req, res, next) {

  let socket = req.socket
  socket.emit("Blockchain:validTransaction",  (response) => {
    console.log(response);
    socket.validTransaction = response.validTransaction
    res.json(response.validTransaction);
  })
});


router.post('/constructBlock', function(req, res, next) {

  let myBlockchain = req.blochchain
  let socket = req.socket
  let validTransaction = socket.validTransaction

  let prevBlock = myBlockchain.lastBlock()
  console.log("lastBlock", prevBlock)
  block = new Block(0, prevBlock.hash, validTransaction, prevBlock.contentTree)
  block.hashValue()

  socket.emit("Blockchain:newBlock", block)
  
  res.json(block);
});


router.get('/depth', function(req, res, next) {

  let myBlockchain = req.blochchain
  let depth = myBlockchain.getDepth();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({depth: depth});
});


router.get('/lastBlock', function(req, res, next) {

  let myBlockchain = req.blochchain
  let lastBlock = myBlockchain.lastBlock();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({lastBlock: lastBlock});
});


// router.get('/content', function(req, res, next) {

//   let blochchain = req.blochchain
//   let prevBlock = blochchain.lastBlock()
//   prevBlock.contentTree.getRootHash()

//   res.json(true);
  
// });



module.exports = router;
