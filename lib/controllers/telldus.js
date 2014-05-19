var exec = require('child_process').exec;

module.exports.on = function telldusOn(swid)
{
    exec("tdtool -n " + swid, null);
    return { type: 'success', message : 'Turned on switch id ' + swid, swid: swid};
}

module.exports.off = function telldusOff(swid)
{
    exec("tdtool -f " + swid, null);
    return { type: 'success', message : 'Turned off switch id ' + swid, swid: swid};
}