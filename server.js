//Requirements
var net = require('net');
var https = require("https");
var fs  = require("fs");
var http = require('http');
var sys = require('sys');
var telldus = require("./lib/controllers/telldus.js");
var parser = require("./lib/parser.js");

//Configurations
var webApiPort = 8081;



//pushco
function sendMessage(message)
{
var obj = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var secret = obj.pushcoSecret;
var key = obj.pushcoKey;
var hostname = 'api.push.co';
var base = "/1.0/push/";

var jsonobj = {
    "message" : message,
    "api_key" : key,
    "api_secret" : secret
}


var jsonobjString = JSON.stringify(jsonobj);
var headers = {
    'Content-Type:' : 'application/json',
    'Content-Length' : jsonobjString.length
}
var options = {
    host: hostname,
    port: 443,
    path: base,
    method: 'POST',
    headers: headers
};



var req = https.request(options, function(res){
    console.log('status: ' + res.statusCode);
    console.log('headers: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(chunk){
        console.log("body: " + chunk);
    });
});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    console.log(e);
});

// write data to request body
req.write(jsonobjString)
req.end();
   
}

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