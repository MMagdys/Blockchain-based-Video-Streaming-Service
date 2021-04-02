var express = require('express');
var router = express.Router();
const WalletLib = require('../../lib/wallet/Wallet');


router.get('/', function(req, res, next) {
  WalletLib.getAllRecords()
  .then((records) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({records: records});
  })
});

router.post('/', function(req, res, next) {
  WalletLib.addNewRecord(req.body)
  .then((records) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({record: records});
  })
});

router.delete('/', function(req, res, next) {
  WalletLib.deleteRecord(req.body._id)
  .then((records) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({record: records});
  })
});


module.exports = router;
