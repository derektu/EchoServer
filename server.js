/**
 * Created with JetBrains WebStorm.
 * User: Derek
 * Date: 13/6/29
 */


var fs = require('fs');
var url = require('url');

// Initialize configuration
//
var nconf = require('nconf');
nconf.file("./config/config.json");

// Create HTTP server
//
var httpport = nconf.get("http:port");
if (typeof(httpport) != 'undefined') {
    var httpServer = require('http').createServer().listen(httpport);

    console.log('HTTP server listening at http://localhost:' + httpport);

    var siotestpage = nconf.get("sioecho:testpage");

    httpServer.on('request', function(req, res) {
        var r = url.parse(req.url);

        if (r.pathname == '/echo') {
            // http://<server>/echo?<something_to_echo_back>
            //
            res.writeHead(200, { 'Content-type': 'text/plain'});
            if (typeof(r.query) != 'undefined')
                res.write(r.query);

            res.end();
        }
        else if (typeof(siotestpage) != "undefined" && r.pathname == siotestpage.path) {
            res.writeHead(200, { 'Content-type': 'text/html'});
            res.end(fs.readFileSync(siotestpage.file));
        }
        else if (r.pathname == "") {
            res.writeHead(302, {
                "Location" : "/"
            });
            res.end();
        }
        else {
            res.writeHead(404);
            res.end();
        }
    });

    // Hookup SIO echo server
    //
    if (nconf.get("sioecho:enable") == "1") {
        var sioechoserver = require("./echo/sioechoserver.js");
        var sioecho = new sioechoserver(httpServer);
        sioecho.start();
    }
}

var tcpport = nconf.get("tcpecho:port");
if (typeof(tcpport) != "undefined") {
    var tcpechoserver = require("./tcpecho/tcpechoserver.js");
    var tcpecho = new tcpechoserver(tcpport);
    tcpecho.start();
}

