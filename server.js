var http = require('http');
var sys = require('sys');
var exec = require('child_process').exec;
var port = 8081;
var obj;


/*function telldusList()
{
  exec("tdtool --list-devices",  function (error, stdout, stderr) {
        return stdout.toString();
  });
}*/


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
 var params = req.url.substring(1).split('/');
console.log(params);
//exec("tdtool -f 4", null);

if(params[0] == 'telldus')
{
if(params[1] == 'on')
{
exec("tdtool -n " + params[2], null);
obj = { type: 'success', message : 'Turned on switch id ' + params[2], swid: params[2]};

res.end(JSON.stringify(obj));
}

else if(params[1] == 'off')
{
        exec("tdtool -f " + params[2], null);
	obj = { type: 'success', message : 'Turned off switch id ' + params[2], swid: params[2]};
	res.end(JSON.stringify(obj));

}

/*else if(params[1] == 'list')
{
	res.end(telldusList());	
 }*/

}
else {
obj = { type: 'Error', message : 'invalid'};
  res.end(JSON.stringify(obj));

}
}).listen(port);


console.log('Server running at http://*:' + port);
var net = require('net');
 
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
        console.log(data);
});
