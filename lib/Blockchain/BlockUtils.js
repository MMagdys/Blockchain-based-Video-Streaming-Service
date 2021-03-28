const TransactionUtils = require('./TransactionUtils')
const Block = require('../Blockchain/Block')


exports.validateBlock = (block, oldContentTree) => {

    if(compareArrays(block.transactions, TransactionUtils.checkValidTx(block.transactions))){
        if(isValidBlock()){
            return true
        }
        else{
            return false
        }
    }
    else {
        console.log("Not a Valid Block")
        return false
    }
}

function isValidBlock() {

    return true
}

exports.updateContentTrie = function updateContentTrie(transactions, oldContentTree) {

    var contentTree = Object.create( oldContentTree );
    for (var index in transactions){

        let tx = transactions[index]
        if(tx.contentBase){
            // If channel => update content trie
            if(tx.outputs.pubKey){
                contentTree.addChannel(tx.outputs)
            }
            // IF Media content
            else if(tx.outputs.channelId){
                let channel = contentTree.getChannel(tx.outputs.channelId)
                let metaHash = tx.outputs.metaData.hash
                if(verifySignature(metaHash, tx.outputs.signature, channel.pubKey)) {
                    channel.addContent(tx.outputs.metaData)
                }
                else{
                    console.log("UnAuthorized!")
                }

            }                
        }
    }
    // console.log(oldContentTree)
    return contentTree
}

function compareArrays(a, b) {

    if(a.length == b.length) {
        for(var i in a) {
            if(a[i] == b[i])
                continue
            else
                return false
        }
        return true
    }

    return false
}

exports.createNewBlock = (payload) => { 
    let blk = new Block(payload.version, payload.prevHash, payload.transactions)
    blk.hashValue()
    return blk
}