const mongoose = require('mongoose');
const schema = mongoose.Schema;
const appDB = require('../../config/appConfig').appDB;
const connect = mongoose.createConnection(appDB);


var LikedVideo = new schema({

    metaDataHash: {
        type: String,
        required: true
    },
	channelId: {
		type: String,
        required: true
    },
});


module.exports = connect.model('LikedVideo', LikedVideo);