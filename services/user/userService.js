const Elliptic = require('../../lib/crypto/Elliptic')


exports.login = (pub, pri) => {

    return new Promise ( async (resolve, reject) => {
        let message = "muhammad"
        let result = await Elliptic.verifySignature(message, Elliptic.sign(message, pri), pub)
        resolve(result)
    })
}
