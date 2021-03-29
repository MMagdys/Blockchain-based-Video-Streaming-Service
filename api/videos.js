var express = require('express');
var router = express.Router();

// const VideosLib = require('../lib/Videos/Videos');
const WebTorrent = require('../lib/Videos/WebTorrent');
const MetaData = require('../lib/Blockchain/MetaData');
const Transaction = require('../lib/Blockchain/Transaction');
const {sign} = require('../lib/crypto/Elliptic')


// router.get('/', function(req, res, next) {
//   let blochchain = req.blochchain
//   VideosLib.myLibrary(blochchain)
//   .then((records) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({records: records});
//   })
// });


router.get('/latest', function(req, res, next) {
  
  let myBlockchain = req.blochchain
  let height = myBlockchain.getDepth()
  let content = []
  var block;
  if(height > 1){
    var currentHash = myBlockchain.lastBlock().hash
    for(var i=height-1; i > 0; i--){
      if(content.length > 20 || i < 2)
        break
      block = myBlockchain.getBlock(i, currentHash)
      for(var j in block.transactions){
        if(block.transactions[j].contentBase){
          if(block.transactions[j].outputs.metaData){
            content.push({metaData: block.transactions[j].outputs.metaData, 
              channelId: block.transactions[j].outputs.channelId})
          }
          
        }
      }
      currentHash = block.prevHash
    }
  }
  res.json({content: content});
});


router.post('/seedVideo', async function(req, res, next) {

  WebTorrent.seedVideo(req.body.videoPath)
  .then((magnetURL) => {
    res.json({url: magnetURL});
  })
});


router.post('/addContent', function(req, res, next) {

  // create new channel
  let amount = req.body.amount ? req.body.amount : 0
  let metaData = new MetaData(req.body.mediaName, req.body.streamHash, amount);

  let trans = new Transaction();
  let sig = sign(metaData.hash, req.body.channelPrivateKey)
  trans.AddContent(metaData, req.body.channelId, sig);

  let socket = req.socket
  socket.emit("Blockchain:newTransaction", trans);
  
  res.json(metaData);
});


router.post('/', function(req, res) {

  WebTorrent.addVideo(req.body.torrent)
  .then((result) => {
      res.statusCode = 200;
    res.send(result);
  })
  .catch((err) => {
      res.statusCode = 500;
      res.send(err)
  })
})


router.get('/stream/:infoHash', async function(req, res, next) {

	if(typeof req.params.infoHash == 'undefined' || req.params.infoHash == '') {
        res.status(500).send('Missing infoHash parameter!'); 
        return;
	}

	try {
        const videoId = req.params.infoHash;
        var file = WebTorrent.streamVideo(videoId)
        const fileSize = file.length;
        const range = req.headers.range

		if(range) {
			var parts = range.replace(/bytes=/, "").split("-");
			var partialstart = parts[0];
			var partialend = parts[1];
			var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : fileSize - 1;
            
            if(start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
                return;
            }

            var chunksize = (end - start) + 1;
            const head = { 
                'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize, 
                'Accept-Ranges': 'bytes', 
                'Content-Length': chunksize, 
                'Content-Type': 'video/mp4' 
            }
            res.writeHead(206, head);
            var stream = file.createReadStream({start: start, end: end});
            stream.pipe(res);

        } 
        else {
            var start = 0; var end = fileSize;
            const head = { 
                'Content-Length': fileSize, 
                'Content-Type': 'video/mp4' 
            }
            res.writeHead(200, head);
            var stream = file.createReadStream({start: start, end: end});
            stream.pipe(res);
        }
        
	} catch (err) {
        console.log(err)
		res.status(500).send('internal service error');
	}
});

module.exports = router;