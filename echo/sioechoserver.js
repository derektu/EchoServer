/**
 * Created with JetBrains WebStorm.
 * User: Derek
 * Date: 13/6/29
 */


// To create SocketIO server, please pass a 'httpServer' instance
//
var sioechoserver = function(httpServer) {
    var _self = this;

    this.httpServer = httpServer;

    // start up server
    //
    this.start = function() {
        _self.sioserver = require('socket.io').listen(_self.httpServer);

        // Define a message handler
        _self.sioserver.sockets.on('connection', function (socket) {
            socket.on('message', function (msg) {
                console.log('Received: ', msg);
                socket.send(msg);
            });
        });
    }
};

module.exports = sioechoserver;

