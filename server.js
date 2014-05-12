//Requirements
var net = require('net');
var https = require("https");
var fs  = require("fs");
var http = require('http');
var sys = require('sys');
var exec = require('child_process').exec;

//Configurations
var webApiPort = 8081;

//Telldus functions

function telldusOn(swid)
{
    exec("tdtool -n " + swid, null);
    return { type: 'success', message : 'Turned on switch id ' + swid, swid: swid};
}

function telldusOff(swid)
{
    exec("tdtool -f " + swid, null);
    return { type: 'success', message : 'Turned off switch id ' + swid, swid: swid};
}

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
console.log(jsonobj)

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
console.log(base);    
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
                res.end(JSON.stringify(telldusOn(swid)));
            }

            if(command == 'off')
            {
                res.end(JSON.stringify(telldusOff(swid)));
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
        //Log the data to the console
       // console.log(data);¨
       
       if(data == '16:TDRawDeviceEvent96:class:command;protocol:arctech;model:selflearning;house:11667822;unit:12;group:0;method:turnoff;i1s')
       {
           console.log("Switch OFF 1");
           telldusOff(4);
           sendMessage("Turning off main lights");
       }
        if(data == '16:TDRawDeviceEvent95:class:command;protocol:arctech;model:selflearning;house:11667822;unit:12;group:0;method:turnon;i1s')
       {
           console.log("Switch ON 1");
           telldusOn(4);
           sendMessage("Turning on main lights");
       }
       if(data == '16:TDRawDeviceEvent95:class:command;protocol:arctech;model:selflearning;house:11667822;unit:11;group:0;method:turnon;i1s')
       {
            console.log("Switch ON 2");    
            telldusOn(6);
       }
        if(data == '16:TDRawDeviceEvent96:class:command;protocol:arctech;model:selflearning;house:11667822;unit:11;group:0;method:turnoff;i1s')
       {
            console.log("Switch OFF 2");
            telldusOff(6);
       }
       
});