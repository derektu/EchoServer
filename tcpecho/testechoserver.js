/**
 * Created with JetBrains WebStorm.
 * User: Derek
 * Date: 13/6/29
 */

var tcpechoserver = require('./tcpechoserver.js');
var server = new tcpechoserver(8001);
server.start();
