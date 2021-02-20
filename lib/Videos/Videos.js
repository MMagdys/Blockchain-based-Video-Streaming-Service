const WalletLib = require('../wallet/Wallet');

exports.myLibrary = (blockchain) => {
    return new Promise ( (resolve, reject) => {

        WalletLib.getAllRecords()
        .then((records) => {
            console.log()
            let videosPath = []
            for (const record of records) {
                console.log(record)
                let block = blockchain.getBlock(record.blockDepth, record.blockHash)
                if(block) {
                    videosPath.push(block.value)
                }
            }
            resolve(videosPath)
        })
    })
}

exports.renderVideo = (videoInfo) => {
    
}