const TransactionUtils = require('../Blockchain/TransactionUtils')
const BlockUtils = require('../Blockchain/BlockUtils')
const Blockchain = require('../Blockchain/Blockchain')
const PatriciaTrie = require('../Blockchain/PatriciaTrie')

// const redis = require('redis');
// const TxPublisher = redis.createClient();
// TxPublisher.select.bind(TxPublisher, 1);

let BLOCKCHAIN = new Blockchain();
let tempTransactions = [];
let neighbours = []
let CONTENTTREE = new PatriciaTrie()

module.exports = (io, socket) => {

  neighbours.push(socket.id)
  console.log(neighbours)

  const newBlock = (payload) => {
    console.log("NEW BLOCK BROADCASTED: ", payload);
    // validate the block and add to the blockchain
    // check if it shared with me and update wallet
    block = BlockUtils.createNewBlock(payload)
    const verified = BlockUtils.validateBlock(block)
      if(verified){
        BLOCKCHAIN.addBlock(block)
        BlockUtils.updateContentTrie(block.transactions, CONTENTTREE)
        io.emit("Blockchain:newBlock", block)
        tempTransactions = []
        // for(var i in payload.transactions){
        //   let index = tempTransactions.indexOf(payload.transactions[i])
        //   console.log("YATSTAAA", i, index ,payload.transactions[i], tempTransactions)
        //   if(index > -1 ){
        //     tempTransactions.splice(index, 1)
        //   }
        // }
      }
  }

  const newTransaction = (payload) => {
    console.log("new TX", payload, "\n");
    if(TransactionUtils.isvalid(payload, CONTENTTREE)){
      console.log("valid transaction")
      tempTransactions.push(payload)
      // for(var i in neighbours){
      //   console.log("SENDING TO", neighbours[i].id)
      //   socket.to(neighbours[i]).emit("Blockchain:newTransaction", payload)
      // }
      io.emit("Blockchain:newTransaction", payload)
      // publisher.publish("new-transaction", JSON.stringify(payload))
    }
  }

  const getvalidTransaction = (callback) => {
    console.log("WANTS VATX")
    socket.emit("Blockchain:validTransaction", tempTransactions)
    callback({
      status: "ok",
      validTransaction : tempTransactions
    });
    // return tempTransactions;
  }

  const getBlocks = (callback) => {
    socket.emit("Blockchain:blocks", tempTransactions)
    callback({
      blocksHeader : BLOCKCHAIN.getBlocks()
    });
  }

  const getBlockchain = (callback) => {
    socket.emit("Blockchain:blocks", tempTransactions)
    callback({
      blocks : BLOCKCHAIN.blocks
    });
  }

  
  
  socket.on("Blockchain:blocks", getBlocks);
  socket.on("Blockchain:blockchain", getBlockchain);
  socket.on("Blockchain:newBlock", newBlock);
  socket.on("Blockchain:newTransaction", newTransaction);
  socket.on("Blockchain:validTransaction", getvalidTransaction);
    
}
