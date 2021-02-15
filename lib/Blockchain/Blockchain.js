const Block = require('./Block');
const {generateKeyPair} = require('../crypto/Elliptic')

class Blockchain {

    constructor(genesisBlock) {
        this.blocks = [genesisBlock];
        // this.timestamp = Date.now();
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

    addBlock(block){
        this.blocks.push(block)
    }

    lastBlock() {
        return this.blocks[this.blocks.length - 1];
    }

    getDepth() {
        return this.blocks.length;
    }

}

module.exports = Blockchain;