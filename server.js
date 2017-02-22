#!/usr/bin/env node
var fs = require('fs');
var PORT = 3000;
var https = require('https');
var httpProxy = require('http-proxy');
var express = require('express');
var harmon = require('harmon');
const path = require('path');
const cookieParser = require('cookie-parser');

var Promise = require('bluebird');
var app = express();

const dynamicProxyMiddleware = (req, res) => {
  let proxy = httpProxy.createServer({
    target: req.cookies.PROXY_TARGET,
    secure: false
  });

  //
  // Listen for the `error` event on `proxy`.
  proxy.on('error', function (err, req, res) {
    res.writeHead(502, {
      'Content-Type': 'text/html'
    });
    res.end(fs.readFileSync(__dirname+'/redirect-root.html'));
  });

  proxy.web(req, res);
};

const noTarget500 = (req, res, next) => {
  console.log("in noTarget500", req.cookies);
  if (req.cookies.PROXY_TARGET) {
    next();
  } else {
    res.status(500);
    res.end(fs.readFileSync(__dirname+'/redirect-root.html'));
  }
}

const noTarget301 = (req, res, next) => {
  if (req.cookies.PROXY_TARGET) {
    next();
  } else {
    res.redirect('/');
  }
}

const signinRewriteMiddleware = (req, res, next) => {
  req.url = '/';

  var edits = [];

  var style = "<style>"+fs.readFileSync(__dirname+'/inject-style.css')+"</style>";

  edits.push({
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
      ws.write(`<span>${req.cookies.PROXY_TARGET}</span>`);
      rs.pipe(ws, {end: true});
    }
  });

  harmon([], edits)(req, res, next);
}

const fileMiddleware = filePath => (req, res) => {
  fs.createReadStream(path.join(__dirname, filePath)).pipe(res);
}

const reactAppMiddleware = fileMiddleware('public/index.html');

app.use('/node_modules', express.static('node_modules/'));
app.use(express.static('public'));
app.use(cookieParser())
app.get('/signin', noTarget301, signinRewriteMiddleware, dynamicProxyMiddleware);
app.get('/', reactAppMiddleware);
app.get('/app', noTarget301, reactAppMiddleware);
app.get('/app/*', noTarget301, reactAppMiddleware);
app.get('/en/loginSitePicker.html', fileMiddleware('loginSitePicker.html'));
app.get('/en/main.html', fileMiddleware('react/index.html'));
app.get('/bundle.js', fileMiddleware('react/bundle.js'));
app.use(noTarget500, dynamicProxyMiddleware);

https.createServer({
  key: fs.readFileSync('localhost.key', 'utf8'),
  cert: fs.readFileSync('localhost.cert', 'utf8')
}, app).listen(PORT, function() {
  console.log('Proxy server running: https://localhost:'+PORT);
});
