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

var app = express();

var modifications = [];

var style = "<style>"+fs.readFileSync(__dirname+'/inject-style.css')+"</style>";

modifications.push({
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


app.use((req, res, next) => {
  if ( req.url === '/' ) {
    harmon([], modifications)(req, res, next);
  } else if (req.url.match(/^\/en\/loginSitePicker.html/)) {
    harmon([], [{
      query: '.tb-login',
      func: node => {
        var rs = fs.createReadStream(__dirname+'/loginSitePicker.html');
        rs.pipe(node.createWriteStream({outer: true }));
      }
    }])(req, res, next);
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
  console.log('listening on port '+PORT);
});
