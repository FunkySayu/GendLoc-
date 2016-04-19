var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/** ROUTING **/

app.get('/', function (req, res) {
    res.redirect('app')
});

/** SERVER INSTANCE **/

app.use(express.static('../front'));

try {
    var privateKey = fs.readFileSync('privkey.pem', 'utf8');
    var certificate = fs.readFileSync('cert.pem', 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var https = require('https');
    var httpsServer = https.createServer(credentials, app);
    io = require('socket.io').listen(httpsServer);
    httpsServer.listen(443);
} catch (e) {
    console.log(e);
    http.listen(8081, function () {
    });
}

/** SOCKET MANAGMENT **/

var nonAssignedSockets = {};
var operatorsPool = {};
var victimsSockets = {};

function defineRole(informations) {
    switch (informations['role']) {
        case 'operateur':
            console.log('User is now considered as Operator');
            nonAssignedSockets.delete(socket.id);
            operatorsPool[socket.id] = socket;
            break;
        case 'victime':
            console.log('User is now considered as Victim');
            nonAssignedSockets.delete(socket.id);
            var victim = {};
            victim[informations['numero']] = socket;
            victimsSockets.push(victim);
    }
}

io.on('connection', function (socket) {
    console.log('User connected');
    nonAssignedSockets[socket.id] = socket;
    socket.on('role', defineRole);
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});