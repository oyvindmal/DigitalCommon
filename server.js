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

else if(params[1] == 'list')
{
	obj = { type: 'error', message : 'Not implemented'};
	res.end(JSON.stringify(obj));
}

}
else {
obj = { type: 'Error', message : 'invalid'};
  res.end(JSON.stringify(obj));

}
}).listen(port);
console.log('Server running at http://*:' + port);
