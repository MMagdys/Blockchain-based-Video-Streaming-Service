const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const {sign, verifySignature} = require('../crypto/Elliptic')


class Block {

    constructor(address, prevHash, value, usersPublicKeys, constants, primitives){
        this.address = address
        this.prevHash = prevHash
        this.merkle_tree = this.createMerkleTree(usersPublicKeys) // membership tree
        this.value = value
        this.constants = constants // Proof comonents 
        this.primitives = primitives  // randomness used
        this.TXPool
        this.timestamp = Date.now();
        this.hash = this.hashValue();
        this.signature
    }

    hashValue() {
        const { value, merkle_tree, constants, timestamp } = this;
        const blockString= `${value}-${merkle_tree.getRoot().toString('hex')}-\
            ${JSON.stringify(constants)}-${timestamp}`;
        const hashDigest = SHA256(blockString);
        console.log("HashValue", hashDigest.toString())
        return hashDigest.toString();
    }

    createMerkleTree(allowedUsersPublicKeys) {
        const leaves = allowedUsersPublicKeys.map(userPK => SHA256(userPK))
        const tree = new MerkleTree(leaves, SHA256)
        const root = tree.getRoot().toString('hex')
        console.log(tree.toString())
        return tree
    }

    signBlock(privateKey) {
        const { value, merkle_tree, constants, timestamp } = this;
        const message = `${value}-${merkle_tree.getRoot().toString('hex')}-\
            ${JSON.stringify(constants)}-${timestamp}`;
        this.signature = sign(message, privateKey)
    }

    verifyBlock() {
        const { value, merkle_tree, constants, timestamp } = this;
        const message = `${value}-${merkle_tree.getRoot().toString('hex')}-\
            ${JSON.stringify(constants)}-${timestamp}`;
        return verifySignature(message, this.signature, this.address)
    }

}

module.exports = Block