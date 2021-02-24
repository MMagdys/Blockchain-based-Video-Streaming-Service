const MetaData = require('./MetaData')


class Channel {

    constructor(id, name, type, amount, pubKey) {
        this.id = id
        this.name= name
        this.type = type
        this.amount = amount
        this.pubKey = pubKey
        this.contents = []
    }

    // addContent(name, streamHash, amount) {
    //     let newContent = new MetaData(name, streamHash, amount)
    //     this.contents.push(newContent)
    // }

    addContent(blockHash) {
        this.contents.push(blockHash)
    }


    getAllContent() {
        return this.contents
    }


}

module.exports = Channel