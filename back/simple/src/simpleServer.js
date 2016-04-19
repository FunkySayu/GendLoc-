var express = require('express');
var fs = require('fs');
var http = require('http');
var app = express();
var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};

var io = require('socket.io')(http);
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

app.get('/', function (req, res) {
    res.redirect('app')
});

app.get('/js/:source', function (req, res) {
    res.sendFile("js/" + req.params.source, options);
});
app.get('/views/:source', function (req, res) {
    res.sendFile("views/" + req.params.source, options);
});

app.use(express.static('../front'));

app.listen(8080, function () {
    console.log('Example app listening on port 3000!');
});
