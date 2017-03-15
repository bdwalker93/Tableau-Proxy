#!/usr/bin/env node
var fs = require('fs');
var https = require('https');
var httpProxy = require('http-proxy');
var express = require('express');
var harmon = require('harmon');
var Promise = require('bluebird');
var url = require('url');
const path = require('path');
const cookieParser = require('cookie-parser');
const ExpressReactViews = require('express-react-views').createEngine;
const glob = Promise.promisify(require('glob'));

let config;
try {
  config = require('./config.json');
} catch (e) {
  config = require('./config.sample.json');
}

const {key, cert, port} = config;

var app = express();

// Resolves with a function taking a template filename (in templateRoot)
// and parameters (React props) and resolving the HTML
function createRenderer(templateRoot) {
  return glob(templateRoot+'/**/*.jsx').then(views => (name, params) => {
    var render = Promise.promisify(ExpressReactViews({ beautify: true }))
    var renderOptions = Object.assign({ settings: { views } }, params);
    return render(path.join(templateRoot, name), renderOptions)
  })
}

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
      createRenderer(__dirname+'/react').then(render=>{
        let target = url.parse(req.cookies.PROXY_TARGET).hostname;
        render('components/SignInHeader.jsx', { target }).then(html=>{
          ws.write(html);
          rs.pipe(ws, {end: true});
        })
      });
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
  key: fs.readFileSync(key, 'utf8'),
  cert: fs.readFileSync(cert, 'utf8')
}, app).listen(port, function() {
  console.log('Proxy server running: https://localhost:'+port);
});
