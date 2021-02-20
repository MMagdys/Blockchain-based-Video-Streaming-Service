var express = require('express');
var router = express.Router();
const VideosLib = require('../lib/Videos/Videos');


router.get('/', function(req, res, next) {
  let blochchain = req.blochchain
  VideosLib.myLibrary(blochchain)
  .then((records) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({records: records});
  })
});



module.exports = router;