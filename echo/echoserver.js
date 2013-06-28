/**
 * Created with JetBrains WebStorm.
 * User: Derek
 * Date: 13/1/14
 * Time: PM5:00
 */

var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    sio = require('socket.io');

var config = initConfig();

var server = http.createServer(function(req, res) {
    var r = url.parse(req.url);
    if (r.pathname == '/echo') {
        // http://<server>/echo?<something_to_echo_back>
        //
        res.writeHead(200, { 'Content-type': 'text/plain'});
        if (typeof(r.query) != 'undefined')
            res.write(r.query);

        res.end();
    }
    else {
        // return index.html
        res.writeHead(200, { 'Content-type': 'text/html'});
        res.end(fs.readFileSync('./echo/index.html'));
    }
});


var port = config.get("echo:port");

server.listen(port, function() {
    console.log('Server listening at http://localhost:' + port);
});

// Attach the socket.io server
io = sio.listen(server);

// Define a message handler
io.sockets.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log('Received: ', msg);
        socket.send(msg);
    });
});

function initConfig()
{
    var nconf = require('nconf');

    nconf.argv().env().file( { file : "./config/config.json" } );
    nconf.defaults({
        "echo" : {
            "port" : 7070
        }
    })
    return nconf;
}