const mongoose = require('mongoose');
const schema = mongoose.Schema;
const appDB = require('../../config/appConfig').appDB;
const connect = mongoose.createConnection(appDB);


var VideoWallet = new schema({

    blockHash: {
        type: String,
        required: true
    },
	blockDepth: {
		type: Number,
        required: true
    },
});


module.exports = connect.model('VideoWallet', VideoWallet);