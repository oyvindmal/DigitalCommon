//Requirements
var net = require('net');
var http = require('http');
var telldus = require("./lib/controllers/telldus.js");
var parser = require("./lib/parser.js");

//Configurations
var webApiPort = 8081;

// Web API

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'});

    var params = req.url.substring(1).split('/');

    console.log(params);

    var controllerName = params[0];

        if(controllerName == 'telldus')
        {
            var command = params[1];
            var swid = params[2];
            if(command == 'on')
            {
                res.end(JSON.stringify(telldus.on(swid)));
            }

            if(command == 'off')
            {
                res.end(JSON.stringify(telldus.off(swid)));
            }

        }
        else {
            var obj = { type: 'Error', message : 'invalid'};
            res.end(JSON.stringify(obj));

        }
}).listen(webApiPort);

console.log('Server running at http://*:' + webApiPort);

//Telldus event listener

// Set up a connection to the TelldusEvents socket
var conn = net.createConnection('/tmp/TelldusEvents');

// Set the encoding so that you get data that is actually readable by humans
conn.setEncoding('utf-8');

//Eventlistener on connection
conn.on('connect' , function () {
        console.log("Connected");
});


//Eventlistener on data recieved
conn.on('data', function(data) {
       
       parser.sendInput(data);
       
       
});