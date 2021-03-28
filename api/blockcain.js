var express = require('express');
var router = express.Router();

const Blockchain = require('../lib/Blockchain/Blockchain');
const Block = require('../lib/Blockchain/Block');
const PatriciaTrie = require('../lib/Blockchain/PatriciaTrie');

// GLOBAL CONSTANTS
let CONTENTTREE = new PatriciaTrie()
let myBlockchain = new Blockchain()


router.get('/', function(req, res, next) {

  let socket = req.socket
  socket.emit("Blockchain:blockchain",  (response) => {
    myBlockchain.blocks = response.blocks
    res.setHeader('Content-Type', 'application/json');
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

  let socket = req.socket
  let validTransaction = socket.validTransaction

  let prevBlock = myBlockchain.lastBlock()
  console.log("lastBlock", prevBlock)
  block = new Block(0, prevBlock.hash, validTransaction, prevBlock.contentTree)
  block.hashValue()

  socket.emit("Blockchain:newBlock", block)
  myBlockchain.addBlock(block)
  
  res.json(block);
});


router.get('/depth', function(req, res, next) {

  let depth = myBlockchain.getDepth();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({depth: depth});
});


router.get('/lastBlock', function(req, res, next) {

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
