var express = require('express');
var router = express.Router();
var cors = require('./cors');

// const VideosLib = require('../lib/Videos/Videos');
const WebTorrent = require('../../lib/Videos/WebTorrent');
const MetaData = require('../../lib/Blockchain/MetaData');
const Transaction = require('../../lib/Blockchain/Transaction');
const {sign} = require('../../lib/crypto/Elliptic')
const initContentService = require('../../services/videos/initContentService');
const likedVideosService = require('../../services/videos/likedVideosService');
const blockchainService = require('../../services/blockchain/blockchainService');


router.options('*', cors.corsWithOptions)


router.get('/init', function(req, res, next) {
  
  let myBlockchain = req.blochchain
  let contentTrie = req.contentTrie
  let socket = req.socket
  
  blockchainService.getBlockchainFromPeers(myBlockchain,socket)
  .then((result) => {
    initContentService.initContent(myBlockchain, contentTrie)
    .then((content) => {
      console.log(contentTrie)
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
      res.json({content: content});
    })
  })
});


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
              // WebTorrent.addVideo(block.transactions[j].outputs.metaData.streamHash)
          }
          
        }
      }
      currentHash = block.prevHash
    }
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.json({content: content});
});


router.post('/seedVideo', async function(req, res, next) {

  WebTorrent.seedVideo(req.body.videoPath)
  .then((magnetURL) => {
    res.json({infoHash: magnetURL});
  })
});


router.post('/addVideo', async function(req, res, next) {

  WebTorrent.seedVideo(req.body.videoPath)
  .then((magnetURL) => {
    console.log(req.body)
    let amount = req.body.amount ? req.body.amount : 0
    let metaData = new MetaData(req.body.mediaName, magnetURL, amount, req.body.thumbnail);

    let trans = new Transaction();
    let sig = sign(metaData.hash, req.body.channelPrivateKey)
    trans.AddContent(metaData, req.body.channelId, sig);

    let socket = req.socket
    socket.emit("Blockchain:newTransaction", trans);
    
    res.json(metaData);
  })
});


router.post('/addContent', function(req, res, next) {

  // create new channel
  let amount = req.body.amount ? req.body.amount : 0
  let metaData = new MetaData(req.body.mediaName, req.body.streamHash, amount, req.body.thumbnail);

  let trans = new Transaction();
  let sig = sign(metaData.hash, req.body.channelPrivateKey)
  trans.AddContent(metaData, req.body.channelId, sig);

  let socket = req.socket
  socket.emit("Blockchain:newTransaction", trans);
  
  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.json(metaData);
});


router.post('/', function(req, res) {

  WebTorrent.addVideo(req.body.infoHash)
  .then((result) => {
      res.statusCode = 200;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.json(result);
  })
  .catch((err) => {
      res.statusCode = 500;
      res.json(err)
  })
})


router.get('/stream/:infoHash', async function(req, res, next) {
  console.log(req.params)
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
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
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
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            res.writeHead(200, head);
            var stream = file.createReadStream({start: start, end: end});
            stream.pipe(res);
        }
        
	} catch (err) {
        console.log(err)
		res.status(500).send('internal service error');
	}
});


router.get('/like', function(req, res, next) {

  let contentTrie = req.contentTrie
  likedVideosService.getAllLikes(contentTrie)
  .then((result) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.json(result);
  })
});


router.post('/like', function(req, res, next) {

  likedVideosService.likeVideo(req.body)
  .then((result) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.json(result);
  })
});


router.post('/unlike', function(req, res, next) {

  likedVideosService.unLikeVideo(req.body)
  .then((result) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.json(result);
  })
});


// router.post()


// router.get('/video', function(req, res) {
//   const path = 'assets/[720pMkv.Com]_Suits.S03E07.480p.WEB-DL.x264-GAnGSteR.mp4'
//   const stat = fs.statSync(path)
//   const fileSize = stat.size
//   const range = req.headers.range

//   if (range) {
//     const parts = range.replace(/bytes=/, "").split("-")
//     const start = parseInt(parts[0], 10)
//     const end = parts[1]
//       ? parseInt(parts[1], 10)
//       : fileSize-1

//     if(start >= fileSize) {
//       res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
//       return
//     }
    
//     const chunksize = (end-start)+1
//     const file = fs.createReadStream(path, {start, end})
//     const head = {
//       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunksize,
//       'Content-Type': 'video/mp4',
//     }

//     res.writeHead(206, head)
//     file.pipe(res)
//   } else {
//     const head = {
//       'Content-Length': fileSize,
//       'Content-Type': 'video/mp4',
//     }
//     res.writeHead(200, head)
//     fs.createReadStream(path).pipe(res)
//   }
// });



module.exports = router;