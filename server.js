//Requirements
var net = require('net');
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

// Web API

http.createServer(function (req, res) {
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    var params = req.url.substring(1).split('/');
    console.log(params);
    
        if(params[0] == 'telldus')
        {
            if(params[1] == 'on')
            {
                res.end(JSON.stringify(telldusOn(params[2])));
            }
            
            else if(params[1] == 'off')
            {
                res.end(JSON.stringify(telldusOff(params[2])));
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
       // console.log(data);
});