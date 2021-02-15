// BlockchainHandler.js
module.exports = (io, socket) => {

    const newBlock = (payload) => {
      console.log("NEW BLOCK BROADCASTED: ", payload);
    }

  
  
    socket.on("Blockchain:newBlock", newBlock);
    
}
  