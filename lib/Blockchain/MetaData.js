const SHA256 = require('crypto-js/sha256')

class MetaData {

    constructor(name, streamHash, amount, thumbnail) {
        this.name = name
        this.streamHash = streamHash
        this.amount = amount
        this.thumbnail = thumbnail
        this.hash = this.hashValue()
    }

    hashValue() {
        const { name, streamHash, amount } = this;
        const blockString= `${name}-${streamHash}-${amount}`;
        const hashDigest = SHA256(blockString);
        console.log("New MetaData HashValue", hashDigest.toString())
        return hashDigest.toString();
    }

}

module.exports = MetaData