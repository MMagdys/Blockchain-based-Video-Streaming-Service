const TransactionUtils = require('./TransactionUtils')
const Block = require('../Blockchain/Block')
const Channel = require('../Blockchain/Channel')
const {verifySignature} = require('../crypto/Elliptic')


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
                let channelPayload = contentTree.getChannel(tx.outputs.channelId)
                let channel = createChannelFromPayload(channelPayload)
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
    blk.hash = payload.hash
    return blk
}


function createChannelFromPayload(payload){

    let channel = new Channel(payload.id, payload.name, payload.type, payload.amount, payload.pubKey)
    return channel
}