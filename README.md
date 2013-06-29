EchoServer
==========

Use node.js to implement a simple server that echo back client's request data.
This is used to test network roundtrip speed.

Support the following protocols:
- http
- socket.io
- tcp socket

==========
How to run
==========

- configure endpoint by editing config/config.json
    - format of config.json is as follows
        {
            "http" : {
                "port" : 7070
            },

            "sioecho" : {
                "enable" : 1,
                "testpage" : {
                    "path" : "/",
                    "file" : "./echo/index.html"
                }
            },

            "tcpecho" : {
                "port" : 7071
            }
        }

    - if <http.port> is defined, then http endpoint will be created, and user can navigate to
      http://server:<http.port>/echo to access the echo url

    - if <sioecho.enable> is set to 1, then sio endpoint will be created. Note currently sio port
      is defined as the same as <http.port>

    - when sioecho is enabled, you can optionally define the location of sio test url via <sioecho.testpage>.
      In the above configuration, when you browse to http://server:<http.port>/, server will return a html
      page that provides testing UI for sio echo service

    - if <tcpecho.port> is defined, then tcp endpoint will be created

- to run the service
    $ node server.js


- to test http endpoint
	- call http://server:<http.port>/echo?string_to_be_echoback,
	- this url will return a text string exactly as 'string_to_be_echoback'

- to test socket.io endpoint
	- use socket.io protocol to connect to http://server:<http.port>, and then send message with the content of the data that you
	  want server to echo, and server will respond with a message of the expected data
	- alternatively browse to http://server:<http.port>/<sioecho.testpage.path>, and this will return a html that
	  let you enter echo string


- to test tcp endpoint
	- tcp socket connect to server:<tcpecho.port>
	- send <string_to_be_echoback> followed by \r\n
	- server will send back <string_to_be_echoback>\r\n
	
==========
How to use this service
==========

- write a client that utilize any of the three protocol, and send a message that includes data/time information (such as current clock),
- since server will echo back whatever client sent, so client can calculate the request round-trip time by parsing the return data

 	 


		  
	
		 
