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

app.listen(8081, function () {

});

/*https.createServer({}, app).listen(443, function () {
    console.log('Example app listening on port 3000!');
});*/
