var express = require('express');
var router = express.Router();

const {generateKeyPair} = require('../../lib/crypto/Elliptic')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/newKeyPair', function(req, res, next) {

  let keyPair = generateKeyPair();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(keyPair);
});



module.exports = router;
