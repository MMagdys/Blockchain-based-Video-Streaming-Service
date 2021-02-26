var express = require('express');
var router = express.Router();
// const BlockchainLib = require('../lib/Blockchain/Blockchain');
const Block = require('../lib/Blockchain/Block');
const Transaction = require('../lib/Blockchain/Transaction');
const MetaData = require('../lib/Blockchain/MetaData');
const Channel = require('../lib/Blockchain/Channel');
const PatriciaTrie = require('../lib/Blockchain/PatriciaTrie');

// let blochchain = new BlockchainLib("genisis");
const {generateKeyPair, sign} = require('../lib/crypto/Elliptic')


router.get('/', function(req, res, next) {
  let blochchain = req.blochchain
  res.setHeader('Content-Type', 'application/json');
  res.json({blochchain: blochchain.getBlocks()});
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


router.post('/test', function(req, res, next) {

  let blochchain = req.blochchain
  const keyPair = generateKeyPair();

  // create new channel
  let myChannel = new Channel("magdy", "Magdy Dev", "public", 0, keyPair.publicKey)

  // uploading the video and getting the Video MetaData
  const newVideo = new MetaData("Some Test Video", "1AC8EEC-StreamHash-DCD5589", 0)
  const metaSig = sign(newVideo.hash, keyPair.privateKey)
  console.log("Meta Signature", metaSig)

  // make a new tx to add the video to the channel
  tx = new Transaction()
  tx = new Transaction(newVideo, "magdy", metaSig, keyPair.publicKey)

  // tx = new Transaction("tcp://file1", "123456F")
  // console.log(tx, "\n\n")
  // tx = new Transaction()
  // console.log(tx)
  // tx.addInput("tcp://file1", "sig(hash(meta))")
  // tx.addOutput("FFEEAA")
  // tx.addOutput("CCAA55")
  
  let prevBlock = blochchain.lastBlock()
  prevBlock.contentTree.addChannel(myChannel)
  blk = new Block(0, prevBlock.hash, [tx], prevBlock.contentTree)
  console.log(blk)
  blk.verifyBlock()
  blochchain.addBlock(blk)
  res.json({blochchain: blochchain.getBlocks()});
});


router.get('/test2', function(req, res, next) {

  let blochchain = req.blochchain
  
  res.json({blochchain: blochchain.lastBlock().contentTree._nodes});
});

router.get('/test3', function(req, res, next) {

  let blochchain = req.blochchain
  const keyPair = generateKeyPair();
  let myChannel = new Channel("hello", "hello channel", "public", 0, keyPair.publicKey)
  console.log("new",myChannel)
  // let trie = new PatriciaTrie()
  // trie.addChannel(myChannel)

  // console.log(trie.getChannel("magdy"))
  let prevBlock = blochchain.lastBlock()
  prevBlock.contentTree.addChannel(myChannel)
  let contents = prevBlock.contentTree.nodes


  res.json({contents: contents});
});

router.get('/test4', function(req, res, next) {

  let blochchain = req.blochchain

  let lastBlock = blochchain.lastBlock()
  let contents = lastBlock.contentTree.nodes

  let contentsObj = []

  // content.traverse(content.root, [])

  
  
  res.json({contents: contents});
});




module.exports = router;
