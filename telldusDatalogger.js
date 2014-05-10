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