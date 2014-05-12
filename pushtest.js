var https = require("https");
var fs  = require("fs");
sendMessage("lol");
function sendMessage(message)
{
var obj = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var secret = obj.pushcoSecret;
var key = obj.pushcoKey;
var hostname = 'api.push.co';
var base = "/1.0/push/";

var url = base + "?message=" + message + "&api_key=" + key + "&api_secret=" + secret;
var options = {
    host: hostname,
    port: 443,
    path: url,
    method: 'POST'
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
req.write('data\n');
req.write('data\n');
req.end();
console.log(url);    
}