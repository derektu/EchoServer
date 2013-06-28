/**
 * Created with JetBrains WebStorm.
 * User: Derek
 * Date: 13/6/25
 */

var net = require('net');
var map = require('./map.js');
var shortid = require('shortid');

var config = initConfig();
var port = config.get("tcpecho:port");

var mapSocketBuf = new map();

var server = net.createServer();
server.listen(port);

console.log('TcpEchoServer listening on ' + server.address().address +':'+ server.address().port);
server.on('connection', function(sock) {

    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    sock.id = shortid.generate();
    mapSocketBuf.add(sock.id, new Buffer(0));
    sock.on('data', function(data) {

        console.log('DATA ' + sock.remoteAddress + '[' + sock.remotePort + ']' + ': ' + data);

        // collect and parse the data
        //
        var buf = mapSocketBuf.get(sock.id);
        if (buf == null || buf.length == 0) {
            buf = data;
        }
        else {
            buf = Buffer.concat([buf, data]);
        }

        buf = parseBuffer(buf, function(frame) {
            sock.write(frame + '\r\n');  // echo frame
        });

        mapSocketBuf.add(sock.id, buf);
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(had_error) {
        mapSocketBuf.remove(sock.id);
    });
});

function initConfig()
{
    var nconf = require('nconf');

    nconf.argv().env().file( { file : "./config/config.json" } );
    nconf.defaults({
        "tcpecho" : {
            "port" : 7071
        }
    })
    return nconf;
}

// Parse buffer
//  - a 'frame' is defined as a sequence of bytes that ends with '\r\n' (frame itself excludes '\r\n')
//  - call 'callback' function, passing the frame object,
//  - return the remaining bytes (as a Buffer object)
//
function parseBuffer(buf, callback)
{
    var idxStart = 0;
    var idxCurrent = 0;

    while (idxCurrent < buf.length) {
        if (buf[idxCurrent] == 13 && idxCurrent < buf.length-1 && buf[idxCurrent+1] == 10) {
            if (idxCurrent > idxStart)
                callback(buf.slice(idxStart, idxCurrent));

            idxCurrent += 2;
            idxStart = idxCurrent;
        }
        else {
            idxCurrent++;
        }
    }

    return buf.slice(idxStart);
}
