exports.getBlockchainFromPeers = (blockchain, socket) => {

    return new Promise ( (resolve, reject) => {

        socket.emit("Blockchain:blockchain",  (response) => {
            blockchain.blocks = response.blocks
            resolve(true)
        })
    })
}

