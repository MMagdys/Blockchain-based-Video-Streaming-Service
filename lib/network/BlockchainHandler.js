// BlockchainHandler.js
const TransactionUtils = require('../Blockchain/TransactionUtils')
const BlockUtils = require('../Blockchain/BlockUtils')
const Blockchain = require('../Blockchain/Blockchain')
const PatriciaTrie = require('../Blockchain/PatriciaTrie')

let BLOCKCHAIN = new Blockchain();
let contentTrie = new PatriciaTrie();

module.exports = (socket) => {

    const newBlock = (payload) => {
      console.log("NEW BLOCK BROADCASTED: ", payload);
      // validate the block and add to the blockchain
      // check if it shared with me and update wallet
      const verified = BlockUtils.validateBlock(payload)
      if(verified){
        BLOCKCHAIN.addBlock(payload)
        BlockUtils.updateContentTrie(payload.transactions, contentTrie)
        console.log(contentTrie)
      }
    }

    const newTransaction = (payload) => {
      console.log("NEW VALID TRANSACTION RECIEVED", payload);
      // if(TransactionUtils.checkValidTx(payload)){
      //   tempTransactions.push(payload);
      //   console.log(payload)
      // }
      // publisher.publish("new-transaction", JSON.stringify(payload))
    }

    const validTransaction = (payload) => {
      console.log("VALID TX RECIEVED ", payload)
      socket.validTransaction = payload
    }

  
  
    socket.on("Blockchain:newBlock", newBlock);
    socket.on("Blockchain:newTransaction", newTransaction);
    socket.on("Blockchain:validTransaction", validTransaction);
    
}
