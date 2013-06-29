/**
 * Created with JetBrains WebStorm.
 * User: Derek
 * Date: 13/6/29
 */

var sioechoserver = require('./sioechoserver.js');

var fs = require('fs'),
    http = require('http');

var httpServer = http.createServer(function(req, res) {
    // return index.html
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync('index.html'));
});

httpServer.listen(8001);

var sioserver = new sioechoserver(httpServer);
sioserver.start();


