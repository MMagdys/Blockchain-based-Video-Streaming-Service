const SHA256 = require('crypto-js/sha256');
const MetaData = require('./MetaData');
const primitives = require('../crypto/Primitives');

class Commitment {

    constructor(videoName, streamHash, publicKeyAddr) {
        this.r
        this.s
        this.row
        this.apk = publicKeyAddr
        this.value = new MetaData(videoName, streamHash)
    }

    getCommitment() {
        // return SHA256(this.value)
        var a = primitives.PRF_addr("00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff")
        var b = primitives.PRF_sn("00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff")
        var c = primitives.PRF_pk("00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff")
        console.log(a)
        console.log(b)
        console.log(c)
    }

}

module.exports = Commitment