/**
 * Created with JetBrains WebStorm.
 * User: Derek
 * Date: 13/6/25
 */

var tcpechoserver = function(port) {
    var _self = this;
    this.port = port;

    // start up server
    //
    this.start = function() {
        var net = require('net');
        var map = require('./map.js');
        var shortid = require('shortid');

        _self.server = net.createServer();
        _self.mapSocketBuf = new map();

        _self.server.listen(_self.port);

        console.log('TcpEchoServer listening on ' + _self.server.address().address +':'+ _self.server.address().port);

        _self.server.on('connection', function(sock) {

            console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
            sock.id = shortid.generate();
            _self.mapSocketBuf.add(sock.id, new Buffer(0));

            sock.on('data', function(data) {

                console.log('DATA ' + sock.remoteAddress + '[' + sock.remotePort + ']' + ': ' + data);

                // collect and parse the data
                //
                var buf = _self.mapSocketBuf.get(sock.id);
                if (buf == null || buf.length == 0) {
                    buf = data;
                }
                else {
                    buf = Buffer.concat([buf, data]);
                }

                buf = parseBuffer(buf, function(frame) {
                    sock.write(frame + '\r\n');  // echo frame
                });

                _self.mapSocketBuf.add(sock.id, buf);
            });

            // Add a 'close' event handler to this instance of socket
            sock.on('close', function(had_error) {
                _self.mapSocketBuf.remove(sock.id);
            });
        });
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
};

module.exports = tcpechoserver;
