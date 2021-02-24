var express = require('express');
var router = express.Router();
// const BlockchainLib = require('../lib/Blockchain/Blockchain');
const Block = require('../lib/Blockchain/Block');
const Transaction = require('../lib/Blockchain/Transaction');

// let blochchain = new BlockchainLib("genisis");
const {generateKeyPair} = require('../lib/crypto/Elliptic')


router.get('/', function(req, res, next) {
  let blochchain = req.blochchain
  res.setHeader('Content-Type', 'application/json');
  res.json({blochchain: blochchain});
});


router.post('/block', function(req, res, next) {
    console.log(req.socket.id)
    let blochchain = req.blochchain

    const keyPair = generateKeyPair();
    let newBlock = new Block(keyPair.publicKey, "hash", 'tcp://file1', ['a', 'b', 'c'], 
      {provingKeys: "someConstants"}, "zxy");
    newBlock.signBlock(keyPair.privateKey)
    blochchain.addBlock(newBlock)

    req.socket.emit("Blockchain:newBlock", {Block: newBlock})
    res.send('respond with a resource');
});


router.get('/depth', function(req, res, next) {
  let blochchain = req.blochchain
  let depth = blochchain.getDepth();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({depth: depth});
});


router.get('/lastBlock', function(req, res, next) {
  let blochchain = req.blochchain
  let lastBlock = blochchain.lastBlock();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({lastBlock: lastBlock});
});


router.get('/test', function(req, res, next) {
  // let tx = new Transaction(["tx1", "tx2"])
  // console.log(tx, "\n\n")
  // tx = new Transaction("tcp://file1", "123456F")
  // console.log(tx, "\n\n")
  tx = new Transaction()
  console.log(tx)
  tx.addInput("123456", 0)
  tx.addOutput("FFEEAA")
  tx.addOutput("CCAA55")

  blk = new Block(0, "prev", [tx], null)
  console.log(blk)
  blk.verifyBlock()
  res.json({tx: blk});
});

module.exports = router;
