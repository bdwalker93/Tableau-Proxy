var fs = require('fs');
var PORT = 3000;
var https = require('https');
var httpProxy = require('http-proxy');
var connect = require('connect');
var harmon = require('harmon');

var proxy = httpProxy.createServer({
  target: 'https://tableau.ics.uci.edu',
  secure: false
})


var app = connect();

var selects = [];
var simpleselect = {};

simpleselect.query = '.tb-login-form-container';
simpleselect.func = function (node) {
	node.createWriteStream().end('<div>+ Trumpet</div>');
}

//selects.push(simpleselect);

app.use(harmon([],selects));

app.use((req, res) => {
  proxy.web(req, res);
})

https.createServer({
  key: fs.readFileSync('localhost.key', 'utf8'),
  cert: fs.readFileSync('localhost.cert', 'utf8')
}, app).listen(PORT, function() {
  console.log('listening on port '+PORT);
});
