EchoServer
==========

Use node.js to implement a simple server that echo back client's request data.
This is used to test network roundtrip speed.

Support the following protocols:
- socket.io
- tcp socket
- http

==========
How to run
==========

- configure endpoint by editing config/config.json

- for socket.io & http endpoint
	$ node echo/echoserver.js
	
	
- for tcp socket endpoint
	$ node tcpecho/tcpechoserver.js

- to test socket.io endpoint
	- browse to http://server:echoport/, and this will return a html that let you enter echo string
	- or use socket.io protocol to connect to http://server:echoport, and then send message with the content of the data that you
	  want server to echo, and server will respond with a message of the expected data
	
- to test http endpoint
	- call http://server:echoport/echo?string_to_be_echoback, and this will return a simple html containing exactly 'string_to_be_echoback'
	
- to test tcp endpoint
	- tcp socket connect to server:tcpechoport
	- send <string_to_be_echoback> followed by \r\n
	- server will send back <string_to_be_echoback>\r\n
	
==========
How to use this service
==========

- write a client that utilize any of the three protocol, and send a message that includes data/time information (such as current clock),
- since server will echo back whatever client sent, so client can calculate the request roundtrip time by parsing the return data

 	 


		  
	
		 
