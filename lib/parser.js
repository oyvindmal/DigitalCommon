var fs  = require("fs");
var telldus = require("./lib/controllers/telldus.js");
var obj = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'));



module.exports.sendInput = function sendInput(input)
{
    var match;
    
    obj.forEach(function(m) {
       if(m.input === input) {
           match = m;
       }
    });
    
    if(match === undefined) {
        console.log("No match");
    }
    else {
        var commands = match.commands;
        commands.forEach(function (com) {
            if(com.type === "TelldusOn"){
              //  TelldusOn(com.SwitchId);
              telldus.on(com.SwitchId);
            }
            
            else if(com.type === "TelldusOff") {
                telldus.off(com.SwitchId);
            }
          
            else {
                console.log("Command not defined (" + com.type + ")");
            }
        })
    }
}



