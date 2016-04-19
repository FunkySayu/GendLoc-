var fs = require('fs');
var express = require('express');
var https = require('https');
var app = express();
var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};
//https
var privateKey  = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

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

// app.listen(8081, function () {
// });

httpsServer.listen(443);
