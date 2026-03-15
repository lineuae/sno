var http = require('http');

let started = false;

function start() {
  if (started) return;
  started = true;
  http.createServer(function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write("Hey Line, don't worry i will always be by your side!");
    res.end();
  }).listen(process.env.PORT || 8080);
}

module.exports = start;
