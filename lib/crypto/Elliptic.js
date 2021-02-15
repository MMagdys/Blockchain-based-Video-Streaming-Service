// import elliptic from "elliptic";
const elliptic = require('elliptic')
const ec = new elliptic.ec("secp256k1");

exports.generateKeyPair = function generateKeyPair(){
    const key = ec.genKeyPair();
    return {
        publicKey: key.getPublic("hex"),
        privateKey: key.getPrivate("hex")
    }
}

exports.sign =  function sign(message, privateKey){
    const key = ec.keyFromPrivate(privateKey, "hex")
    return key.sign(message).toDER("hex")
}

exports.verifySignature = function verifySignature(message, signature, publicKey){
    try {
        const key = ec.keyFromPublic(publicKey, "hex");
        return ec.verify(message, signature, key);
    } 
    catch (error) {
        return false;
    }
}