const BlockUtils = require('../../lib/Blockchain/BlockUtils')


exports.initContent = (blockchain, contentTrie) => {

    return new Promise ( (resolve, reject) => {

        let height = blockchain.getDepth()
        let content = []
        var block;
        var currentHash;

        if(height > 1){ 
            for(var i=2; i < height; i++){
                currentHash = blockchain.blocks[i].hash
                block = blockchain.getBlock(i, currentHash)
                BlockUtils.updateContentTrie(block.transactions, contentTrie, block.timestamp)

                for(var j in block.transactions){
                    if(block.transactions[j].contentBase){
                        if(block.transactions[j].outputs.metaData){
                            content.unshift({metaData: {...block.transactions[j].outputs.metaData, timestamp: block.timestamp }, 
                            channelId: block.transactions[j].outputs.channelId})
                            // WebTorrent.addVideo(block.transactions[j].outputs.metaData.streamHash)
                        }
                    }
                }
            }
        }
        resolve(content)
    })
}

