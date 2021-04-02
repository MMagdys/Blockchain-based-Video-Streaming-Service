var express = require('express');
var cors = require('cors');
var app = express();


const whitelist = ['http://localhost:3000', 'http://18.193.46.139'];

var corsOptions = {
    origin: function (origin, callback) {
      console.log("origin", origin)
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, { origin: true })
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }


exports.cors = cors();
exports.corsWithOptions = cors(corsOptions);