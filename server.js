var fs = require('fs');
var PORT = 3000;
var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createServer({
  ssl: {
    key: fs.readFileSync('localhost.key', 'utf8'),
    cert: fs.readFileSync('localhost.cert', 'utf8')
  },
  target: 'https://tableau.ics.uci.edu',
  secure: false
})

proxy.listen(PORT);
