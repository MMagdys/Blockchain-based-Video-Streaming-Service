const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const {sign, verifySignature} = require('../crypto/Elliptic')
var Base = require('merkle-tree').Base;
var merkle_mod = require('merkle-tree');
const PatriciaTrie = require('./PatriciaTrie')

const Channel = require('./Channel');

class Block {

    constructor(version, prevHash, transactions, oldContentTree){
        this.version = version
        this.prevHash = prevHash
        this.transactions = transactions
        this.timestamp = Date.now();
        // this.prevContentTree = oldContentTree
        this.hash;
        // this.contentTreeStruct = oldContentTree ? this.updateContentTree(oldContentTree) : null
        // this.contentTree = oldContentTree ? this.updateContentTree(oldContentTree) : null
        // this.contentTree = this.updateContentTree(oldContentTree)
        // this.contentTreeHash = this.contentTree ?  this.updateContentTree(this.contentTree) : null
        // console.log("\n\n LOOK",this.contentTree, this.contentTreeHash)
    }

    hashValue() {
        const { version, prevHash, transactions, timestamp, prevContentTree } = this;
        const blockString= `${version}-${prevHash}-${JSON.stringify(transactions)}-\
            ${prevContentTree}-${timestamp}`;
        const hashDigest = SHA256(blockString);
        console.log("Block HashValue", hashDigest.toString())
        this.hash = hashDigest.toString();
        // return hashDigest.toString();
    }

    // updateContentTree(oldContentTree) {
    //     let tx
    //     let channelPubKey
    //     const zeroHash = MerkleTree.bufferify(SHA256(0))
    //     let leaves = oldContentTree.getLeaves()
    //     // console.log(zeroHash)
    //     for (var index in this.transactions){
    //         tx = this.transactions[index]
    //         if(tx.contentBase){
    //             channelPubKey = tx.outputs.address
    //             // console.log("new Content", leaves)
    //             for(var j=0; j < leaves.length; j++) {
    //                 if(leaves[j].equals(zeroHash)){
    //                     console.log("zerofound")
    //                     let channel = new Channel("username", "newChannel", "public free", 0, tx.outputs.address)
    //                     channel.addContent(this.hash)
    //                     break
    //                 }
    //             }

    //         }

    //     }
    //     return null
    // }

    // updateContentTree(oldContentTree) {
    //     let tx
    //     let channelPubKey
    //     const blockHash = this.hash
    //     // const zeroHash = MerkleTree.bufferify(SHA256(0))
    //     let leaves = oldContentTree._nodes
    //     console.log("UPDATING",oldContentTree)
    //     for (var index in this.transactions){
    //         tx = this.transactions[index]
    //         if(tx.contentBase){
    //             channelPubKey = SHA256(tx.outputs.address)
    //             // console.log("new Content", leaves)
    //             oldContentTree.find({'key' : channelPubKey, 'skip_verify' : false}, function(err, channel) {
    //                 console.log(err, channel)
    //                 if(err){
    //                     console.log(err)
    //                 }
    //                 if (channel) {
    //                     console.log("append the video")
    //                 }
    //                 else{
    //                     let channel = new Channel("username", "newChannel", "public free", 0, tx.outputs.address)
    //                     channel.addContent(blockHash)
    //                     oldContentTree.upsert({'key' : channelPubKey, 'value' : channel}, function(err, newRootHash) {
    //                         if(err)
    //                             console.log(err)
    //                         // this.contentTreeHash = newRootHash
    //                         // return {contentTree: oldContentTree,  contentTreeHash: newRootHash}
    //                         return newRootHash
    //                     })
    //                 }
    //             });
    //         }

    //     }
    //     return null
    // }

    // updateContentTree(oldContentTree) {
    //     let txs = this.transactions
    //     let channelPubKey
    //     const blockHash = this.hash
    //     let chanId
    //     // let tmpContentTree = t
        
    //     console.log("UPDATING",oldContentTree, "with", txs)
    //     for (var index in txs){
    //         // console.log(txs[index], txs[index].contentBase, txs[index].inputs)
    //         let tx = txs[index]
    //         if(tx.contentBase){
                
    //             chanId = tx.inputs.channelId
    //             let channel = oldContentTree.getChannel(chanId)
    //             channel.addContent(blockHash)
    //             // oldContentTree.addChannel(channel)
                
    //         }

    //     }
    //     console.log("after UPdate", oldContentTree)
    //     return oldContentTree
    // }

    updateContentTree(oldContentTree) {
        let txs = this.transactions
        
        console.log("UPDATING",oldContentTree, "with", txs)
        for (var index in txs){

            let tx = txs[index]
            if(tx.contentBase){
                // If channel => update content trie
                if(tx.outputs.pubKey){
                    oldContentTree.addChannel(tx.outputs)
                }
                // IF Media content
                else if(tx.outputs.channelId){
                    let channel = oldContentTree.getChannel(tx.outputs.channelId)
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
        console.log("after UPdate", oldContentTree)
        return oldContentTree
    }

    verifyBlock() {
        // Verify all Transactions
        // Verify new contentTree hash
        return true
    }

    blockHeader() {
        return {
            version: this.version,
            hash: this.hash,
            prevHash: this.prevHash,
            contentTreeHash: this.contentTreeHash,
            timestamp: this.timestamp         
        }
    }

    createGenisisBlock() {
        // var config = new merkle_mod.Config({ N : 2^64, M : 2 });
        // var myTree = new merkle_mod.MemTree(config);
        // console.log("TREE TEST", myTree)
        
        // let leaves = new Array(2^64).fill(0).map(ch => SHA256(ch))
        // const tree = new MerkleTree(leaves, SHA256)
        // console.log(tree.toString())
        // this.contentTree = myTree
        // this.contentTreeHash = myTree._root
        // this.contentTree = new PatriciaTrie()
        this.hashValue()
    }

    

}

module.exports = Block