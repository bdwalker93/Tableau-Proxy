#!/usr/bin/env node
var fs = require('fs');
var PORT = 3000;
var https = require('https');
var httpProxy = require('http-proxy');
var express = require('express');
var harmon = require('harmon');
const transformerProxy = require('transformer-proxy');
const zlib = require('zlib');
const gzip = zlib.Gzip();
const concatStream = require('concat-stream');
const cookieParser = require('cookie-parser');

var Promise = require('bluebird');
var app = express();

var rootModifications = [];

var style = "<style>"+fs.readFileSync(__dirname+'/inject-style.css')+"</style>";

rootModifications.push({
  query: 'meta[name=viewport]',
  func: node => node.setAttribute('content', 'width=device-width, user-scalable=no')
},{
  query: 'meta[name=apple-itunes-app]',
  func: node => node.createWriteStream({outer: true }).end('')
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
},{
  query: 'body',
  func: node => {
		var rs = node.createReadStream();
		var ws = node.createWriteStream({outer: false});
    ws.write(`<a href="/">Back</a>`);
		rs.pipe(ws, {end: true});
  }
});

const dynamicProxyMiddleware = (req, res) => {
  let proxy = httpProxy.createServer({
    target: req.cookies.PROXY_TARGET,
    secure: false
  });
  proxy.web(req, res);
};

app.use('/node_modules', express.static('node_modules/'));
app.use(express.static('public'));
app.use(cookieParser())

app.get('/signin', (req, res, next) => {
  req.url = '/';
  harmon([], rootModifications)(req, res, next);
}, dynamicProxyMiddleware);

app.get('/app/*', (req, res, next) => {
  fs.createReadStream(__dirname+'/public/app/index.html').pipe(res);
});

app.use((req, res, next) => {
  console.log('generic middleware', req.url);
  if ( req.url === '/' ) {
    fs.createReadStream(__dirname+'/public/app/index.html').pipe(res);
  } else if (req.url.match(/^\/en\/loginSitePicker.html/)) {
    fs.createReadStream(__dirname+'/loginSitePicker.html').pipe(res);
  } else if (req.url.match(/^\/en\/main.html/)) {
    fs.createReadStream(__dirname+'/react/index.html').pipe(res);
  } else if (req.url.match(/^\/bundle.js/)) {
    fs.createReadStream(__dirname+'/react/bundle.js').pipe(res);
  } else {
    next();
  }
}, dynamicProxyMiddleware);

https.createServer({
  key: fs.readFileSync('localhost.key', 'utf8'),
  cert: fs.readFileSync('localhost.cert', 'utf8')
}, app).listen(PORT, function() {
  console.log('Proxy server running: https://localhost:'+PORT);
});
