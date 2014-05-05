var http = require('http');
var sys = require('sys');
var exec = require('child_process').exec;

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
 var params = req.url.substring(1).split('/');
console.log(params);
//exec("tdtool -f 4", null);

if(params[0] == 'on')
{
 res.end("turning on\n");
exec("tdtool -n " + params[1], null);
}

else if(params[0] == 'off')
{
	res.end("Turning off \n");
	exec("tdtool -f " + params[1], null);
}
else {
  res.end('Invalid Command\n');

}
}).listen(8081);
console.log('Server running at http://127.0.0.1:1337/');
