var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var multer = require('multer');
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// TODO : transformer en BDD
var fichesReflexeLocation = __dirname + '/../fichesReflexe';
var photosLocation = __dirname + '/../photos';
var fichesReflexeDB = {
    "pollution.jpg": {
        // Valeurs d'initialisation
        name: "Pollution 1",
        keywords: ["pollution", "environnement"],
        url: "pollution.jpg"
    },
    "pollution2.jpg": {
        name: "Pollution 2",
        keywords: ["pollution", "2"],
        url: "pollution2.jpg"
    }
};

var fichesReflexeStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, fichesReflexeLocation)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var photosStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, photosLocation)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var uploadFichesReflexe = multer({storage: fichesReflexeStorage})
var uploadPhotos = multer({storage: photosStorage})

/** ROUTING **/

app.get('/', function (req, res) {
    res.redirect('app')
});

app.get('/connectedVictims', function (req, res) {
    res.send(victimsSockets.keys());
});

app.get('/fichesReflexe/:source', function (req, res) {
    // Attention, :source ne gère pas une arborescence du côté client,
    // on ne peut pas trier les fiches réflexes par catégorie par exemple
    var options = {
        root: __dirname + '/../',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile("/fichesReflexe/" + req.params.source, options);
});

app.get('/fichesReflexe', function (req, res) {
    var fichesReflexe = fs.readdirSync(fichesReflexeLocation, "utf8");
    var fichesReflexeInformations = fichesReflexe.map(function (element) {
        return fichesReflexeDB[element];
    });
    res.send(fichesReflexeInformations);
});

/*
// TODO : ajout de la possibilité d'uploader des fiches reflexe en tant qu'opérateur
app.post('/fichesReflexe', uploadFichesReflexe.array('fichesReflexe'), function (req, res, next) {
    console.log(req.files);
    console.log(req.files['fichesReflexe']);
    // TODO : ajout BDD
});
*/

app.post('/uploadPhoto', function (req, res, next) {
    var imageBuffer = decodeBase64Image(req.body['photo']);
    var numero = req.body['numero'];
    var timestamp = Date.now();

    var path = require('path');
    var filendir = require('filendir');
    var filepath = path.join(photosLocation, numero,timestamp + '.png');
    var content = imageBuffer.data;

    filendir.ws(filepath, content);
    var informations = {
        numero : numero,
        nomFichier : filepath
    };

    operatorsPool.foreach(function (operatorSocket) {
        // TODO : implement operator side
        operatorSocket.emit('receptionImageOperator', informations);
    });
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
    return function (informations) {
        switch (informations['role']) {
            case 'operateur':
                // TODO : gestion d'un envoi de mot de passe pour l'authentification en tant qu'opérateur
                console.log('User ' + informations['numero'] + ' is now considered as Operator');
                nonAssignedSockets[socket.id] = undefined;
                operatorsPool[socket.id] = socket;
                break;
            case 'victime':
                console.log('User ' + informations['numero'] + ' is now considered as Victim');
                nonAssignedSockets[socket.id] = undefined;
                victimsSockets[informations['numero']] = socket;
        }
    }
}

io.on('connection', function (socket) {
    console.log('User connected');
    nonAssignedSockets[socket.id] = socket;
    socket.on('authentification', defineRole(socket));

    /** EVENT DEMANDE OPERATEUR **/

    /* DEMANDES ENVOYEES A LA VICTIME */

    socket.on('demandeVideoOperateur', function (informations) {
        // Envoie de la demande d'une conversation vidéo à la victime demandée
        victimsSockets[informations['numero']].emit('demandeVideo');
    });

    socket.on('demandePhotoOperateur', function (informations) {
        // Envoie de la demande d'une photo à la victime demandée
        victimsSockets[informations['numero']].emit('demandePhoto');
    });

    socket.on('envoiFicheReflexeOperateur', function (informations) {
        // Envoie de la fiche réflexe à la victime demandée
        victimsSockets[informations['numero']].emit('envoiFicheReflex', informations["reflexLink"]);
    });

    /** RECEPTION DE L'OPERATEUR **/

    socket.on('supprimerSession', function (informations) {
        // TODO : à tester
        delete victimsSockets[informations['numero']];
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}
