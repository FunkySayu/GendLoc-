var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.redirect('app')
});


io.on('connection', function(socket){
    console.log('a user connected');
});

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



var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};