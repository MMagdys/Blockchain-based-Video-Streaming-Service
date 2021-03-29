const Transaction = require('./Transaction')
const {verifySignature} = require('../crypto/Elliptic')

exports.checkValidTx = (txs) => {

    let validTransactions = []

    for(var i in txs) {
        if(isvalid(txs[i], "tre")){
            validTransactions.push(txs[i])
        }
    }


    return validTransactions
}

function isvalid(tx, contentTree){

     // If channel => update content trie
    //  if(tx.contentBase){
    //     if(tx.outputs.pubKey){
    //         // check if name is avaliable
    //         // contentTree.isValidName(tx.outputs.channelId)
    //         if(true){
    //             return true
    //         }
    //         else{
    //             console.log("ERROR: username already in use!")
    //             return false
    //         }
            
    //     }
    //     // IF Media content
    //     else if(tx.outputs.channelId){
    //         let channel = contentTree.getChannel(tx.outputs.channelId)
    //         let metaHash = tx.outputs.metaData.hash
    //         if(verifySignature(metaHash, tx.outputs.signature, channel.pubKey)) {
    //             return true
    //         }
    //         else{
    //             console.log("ERROR: Bad Signature")
    //             return false
    //         }
    //     }
    // }
    // else{

    // }


    return true
}

exports.isvalid = (tx, contentTree) => {

    // If channel => update content trie
    if(tx.contentBase){
        if(tx.outputs.pubKey){
            // check if name is avaliable
            // contentTree.isValidName(tx.outputs.channelId)
            if(contentTree.getChannel(tx.outputs.id) == null){
                console.log("VERIFING ", contentTree.getChannel(tx.outputs.id))
                return true
            }
            else{
                console.log("ERROR: username already in use!")
                return false
            }
            
        }
        // IF Media content
        else if(tx.outputs.channelId){
            let channel = contentTree.getChannel(tx.outputs.channelId)
            if(channel){
                let metaHash = tx.outputs.metaData.hash
                if(verifySignature(metaHash, tx.outputs.signature, channel.pubKey)) {
                    return true
                }
                else{
                    console.log("ERROR: Bad Signature")
                    return false
                }
            }
            else{
                console.log("ERROR: Channel not found!")
                return false
            }
            
        }
    }
    else{
        console.log("NOT CONTENT TX")
    }


    return false
}