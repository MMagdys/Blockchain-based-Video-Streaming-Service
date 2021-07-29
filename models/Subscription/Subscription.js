const mongoose = require('mongoose');
const schema = mongoose.Schema;
const appDB = require('../../config/appConfig').appDB;
const connect = mongoose.createConnection(appDB);


var Subscription = new schema({

	channelId: {
		type: String,
        required: true
    },
    user: {
		type: String,
    },
});


module.exports = connect.model('Subscription', Subscription);