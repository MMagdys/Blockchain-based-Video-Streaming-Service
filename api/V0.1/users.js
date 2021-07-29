var express = require('express');
var router = express.Router();
var cors = require('./cors');

const {generateKeyPair} = require('../../lib/crypto/Elliptic')
const userService = require('../../services/user/userService')

router.options('*', cors.corsWithOptions)

router.get('/newKeyPair', function(req, res, next) {

  let keyPair = generateKeyPair();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(keyPair);
});


router.post('/login', function(req, res, next) {

  userService.login(req.body.pub, req.body.pri)
  .then((result) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.json(result);
  })
  .catch((err) => {
    res.statusCode = 500;
    res.json(err)
  }) 
});



module.exports = router;
