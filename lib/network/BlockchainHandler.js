// BlockchainHandler.js
const TransactionUtils = require('../Blockchain/TransactionUtils')
const BlockUtils = require('../Blockchain/BlockUtils')
const Blockchain = require('../Blockchain/Blockchain')
const Block = require('../Blockchain/Block')
const PatriciaTrie = require('../Blockchain/PatriciaTrie')
const initContentService = require('../../services/videos/initContentService');
const blockchainService = require('../../services/blockchain/blockchainService');

// let BLOCKCHAIN = new Blockchain();
// let contentTrie = new PatriciaTrie();

module.exports = (socket, BLOCKCHAIN, contentTrie) => {

    const newBlock = (payload) => {
      console.log("NEW BLOCK BROADCASTED: ", payload);
      // validate the block and add to the blockchain
      // check if it shared with me and update wallet
      const verified = BlockUtils.validateBlock(payload)
      if(verified){
        let block = BlockUtils.createNewBlock(payload)
        BLOCKCHAIN.addBlock(block)
        BlockUtils.updateContentTrie(payload.transactions, contentTrie, block.timestamp)
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

    blockchainService.getBlockchainFromPeers(BLOCKCHAIN,socket)
    .then((result) => {
      initContentService.initContent(BLOCKCHAIN, contentTrie)
      })
      .then((content) => {
        const difficulty = 5*60*1000
        setInterval(() =>  {
          socket.emit("Blockchain:validTransaction",  (response) => {
            // console.log("Current Valid Transactions ",response);
    
            if(response.validTransaction.length > 0){
              let validTransaction = response.validTransaction
              let prevBlock = BLOCKCHAIN.lastBlock()
              block = new Block(0, prevBlock.hash, validTransaction, prevBlock.contentTree)
              block.hashValue()
    
              socket.emit("Blockchain:newBlock", block)
            }
          })
        }, difficulty);
      })
    
  
    socket.on("Blockchain:newBlock", newBlock);
    socket.on("Blockchain:newTransaction", newTransaction);
    socket.on("Blockchain:validTransaction", validTransaction);
    
}
