var http = require('http');
var sys = require('sys');
var exec = require('child_process').exec;
var port = 8081;
var obj;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
 var params = req.url.substring(1).split('/');
console.log(params);
//exec("tdtool -f 4", null);

if(params[0] == 'telldus')
{
if(params[1] == 'on')
{
	res.end("turning on\n");
exec("tdtool -n " + params[2], null);
}

else if(params[1] == 'off')
{
        res.end("Turning off \n");
        exec("tdtool -f " + params[2], null);
}

}
else {
obj = { type: 'Error', message : 'invalid'};
  res.end(JSON.stringify(obj));

}
}).listen(port);
console.log('Server running at http://*:' + port);
