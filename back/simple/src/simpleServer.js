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

function defineRole(socket) {
    return function(informations) {
        switch (informations['role']) {
            case 'operateur':
                console.log('User is now considered as Operator');
                nonAssignedSockets[socket.id] = undefined;
                operatorsPool[socket.id] = socket;
                break;
            case 'victime':
                console.log('User is now considered as Victim');
                nonAssignedSockets[socket.id] = undefined;
                victimsSockets[informations['numero']] = socket;
        }
    }
}

io.on('connection', function (socket) {
    console.log('User connected');
    nonAssignedSockets[socket.id] = socket;
    socket.on('authentification', defineRole);

    setTimeout(function () {
        socket.emit('demandeVideo');
        // TODO
    }, 2000);
    setTimeout(function () {
        socket.emit('demandePhoto');
        // TODO
    }, 4000);
    setTimeout(function () {
        socket.emit('envoiFicheReflex');
        // TODO
    }, 6000);

    socket.on('receptionImage', function (idClient, nomFicher) {
        operatorsPool.foreach(function (operatorSocket) {
            operatorSocket.emit('receptionImageOperator', idClient, nomFicher);
        })
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});