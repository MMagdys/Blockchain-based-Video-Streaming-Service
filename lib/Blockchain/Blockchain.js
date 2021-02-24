const Block = require('./Block');
const {generateKeyPair} = require('../crypto/Elliptic')

class Blockchain {

    constructor() {
        let genesisBlock = new Block(0, null, null, null);
        genesisBlock.createGenisisBlock()
        this.blocks = [genesisBlock];
        this.maxHeight = 10;
    }

    // addBlock(prevHash, value, usersPublicKeys, constants, primitives){
    //     const keyPair = generateKeyPair();
    //     // const keyPair2 = generateKeyPair();
    //     let newBlock = new Block(keyPair.publicKey, prevHash, value, usersPublicKeys, constants, primitives);
    //     newBlock.signBlock(keyPair.privateKey)
    //     console.log("signed", newBlock)
    //     this.blocks.push(newBlock)
    //     console.log("VERIFY: ", newBlock.verifyBlock())
    // }

    getBlocks(){
        let blocksHeader = []
        for(var i in this.blocks){
            blocksHeader.push(this.blocks[i].blockHeader())
        }
        return blocksHeader
    }

    addBlock(block){
        this.blocks.push(block)
    }

    lastBlock() {
        return this.blocks[this.blocks.length - 1];
    }

    getDepth() {
        return this.blocks.length;
    }

    getBlock(depth, hash) {
        // console.log(depth, hash, this.blocks[depth])
        if (this.blocks[depth].hash == hash){
            return this.blocks[depth]
        }
    }

}

module.exports = Blockchain;
