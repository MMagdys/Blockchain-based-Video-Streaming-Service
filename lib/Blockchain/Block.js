const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const {sign, verifySignature} = require('../crypto/Elliptic')


class Block {

    constructor(version, prevHash, transactions, oldContentTree){
        this.version = version
        this.prevHash = prevHash
        this.transactions = transactions
        this.timestamp = Date.now();
        // this.contentTree = this.updateContentTree(oldContentTree)
        // this.contentTreeHash = this.contentTree.getRoot().toString('hex')
        // this.hash = this.hashValue();
    }

    hashValue() {
        const { version, prevHash, transactions, timestamp, contentTreeHash } = this;
        const blockString= `${version}-${prevHash}-${JSON.stringify(transactions)}-\
            ${contentTreeHash}-${timestamp}`;
        const hashDigest = SHA256(blockString);
        console.log("HashValue", hashDigest.toString())
        return hashDigest.toString();
    }

    updateContentTree(oldContentTree) {
        const leaves = allowedUsersPublicKeys.map(userPK => SHA256(userPK))
        const tree = new MerkleTree(leaves, SHA256)
        const root = tree.getRoot().toString('hex')
        console.log(tree.toString())
        return tree
    }

    verifyBlock() {
        // Verify all Transactions
        // Verify new contentTree hash
        return false
    }

}

module.exports = Block