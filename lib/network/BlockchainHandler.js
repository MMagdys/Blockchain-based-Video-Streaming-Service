// BlockchainHandler.js
module.exports = (io, socket) => {

    const newBlock = (payload) => {
      console.log("NEW BLOCK BROADCASTED: ", payload);
      // validate the block and add to the blockchain
      // check if it shared with me and update wallet 
    }

  
  
    socket.on("Blockchain:newBlock", newBlock);
    
}
