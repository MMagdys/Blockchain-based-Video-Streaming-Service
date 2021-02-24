const Transaction = require('./Transaction')

exports.checkValidTx = (txs) => {

    let validTransactions = []

    for(var i in txs) {
        if(txs[i].isvalid()){
            validTransactions.push(txs)
        }
    }


    return validTransactions
}