const VideoWalletModel = require('../../models/Wallet/VideoWallet')

exports.getAllRecords = () => {
    return new Promise ( (resolve, reject) => {

        VideoWalletModel.find({})
        .then((records) => {
            resolve(records)
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

exports.addNewRecord = (recordInfo) => {
    return new Promise ( (resolve, reject) => {

        let newRecord = new VideoWalletModel(recordInfo);
        newRecord.save({})
        .then((record) => {
            resolve(record)
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

exports.deleteRecord = (recordInfo) => {
    return new Promise ( (resolve, reject) => {

        VideoWalletModel.remove({_id: recordInfo})
        .then((records) => {
            resolve(records)
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}