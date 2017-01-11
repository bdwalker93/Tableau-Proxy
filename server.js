#!/usr/bin/env node
var fs = require('fs');
var PORT = 3000;
var https = require('https');
var httpProxy = require('http-proxy');
var express = require('express');
var harmon = require('harmon');

var proxy = httpProxy.createServer({
  target: 'https://tableau.ics.uci.edu',
  secure: false
})

var Promise = require('bluebird');
var app = express();

var rootModifications = [];

var style = "<style>"+fs.readFileSync(__dirname+'/inject-style.css')+"</style>";

rootModifications.push({
  query: 'meta[name=viewport]',
  func: node => node.setAttribute('content', 'width=device-width, user-scalable=no')
},{
  query: 'meta[name=apple-itunes-app]',
  func: node => {
    console.log('removing apple shit');
    return node.createWriteStream({outer: true }).end('')
  }
},{
  query: 'head',
  func: node => {

		var rs = node.createReadStream();
		var ws = node.createWriteStream({outer: false});

		// Read the node and put it back into our write stream, 
		// but don't end the write stream when the readStream is closed.
		rs.pipe(ws, {end: false});

		// When the read stream has ended, attach our style to the end
		rs.on('end', function(){
			ws.end(style);
		});
  }
});


const transformerProxy = require('transformer-proxy');
const zlib = require('zlib');
const gzip = zlib.Gzip();


const concatStream = require('concat-stream');

app.use((req, res, next) => {
  if ( req.url === '/' ) {
    harmon([], rootModifications)(req, res, next);
  } else if (req.url.match(/^\/en\/loginSitePicker.html/)) {
    fs.createReadStream(__dirname+'/loginSitePicker.html').pipe(res);
  } else if (
    req.url.match(/^\/vizportal\/api\/web\/v1\/getSessionInfo/) ||
    req.url.match(/^\/vizportal\/api\/web\/v1\/login/) ||
    req.url.match(/^\/vizportal\/api\/web\/v1\/switchSite/)
  ) {
    transformerProxy(function(data, req, res) {
      console.log('in transformer...');
      console.log(res._headers['content-encoding']);
      if (res._headers['content-encoding'] === 'gzip') {
        console.log('THIS IS A GZIP');
      }
      if (res.statusCode !== 200) return data;
      return new Promise(function(resolve, reject) {
        var gunzip = zlib.createGunzip();            
        gunzip.on('error', reject);
        gunzip.pipe(concatStream(resolve));
        gunzip.write(data);
        gunzip.end();
      }).then((data) => {
        try {
          let obj = JSON.parse(data);
          obj.result.user.startPage = '/workbooks';
          return JSON.stringify(obj);
        } catch (e) {
          return data;
        }
      }).catch(err=>{
        console.log(err.message);
        return "{}"
      }).then((data) => {
        return new Promise(function(resolve, reject) {
          var gzip = zlib.createGzip();            
          gzip.on('error', reject);
          gzip.pipe(concatStream(resolve));
          gzip.write(data);
          gzip.end();
        });
      }).catch(err=>{
        console.log(err.message);
        return "{}"
      })
    })(req,res,next);

  } else {
    next();
  }
}, (req, res, next) => {
  proxy.web(req, res);
});

https.createServer({
  key: fs.readFileSync('localhost.key', 'utf8'),
  cert: fs.readFileSync('localhost.cert', 'utf8')
}, app).listen(PORT, function() {
  console.log('Proxy server running: https://localhost:'+PORT);
});
