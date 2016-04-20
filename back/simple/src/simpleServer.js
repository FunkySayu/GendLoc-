var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var multer = require('multer')

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

var uploadFichesReflexe = multer({ storage: fichesReflexeStorage })
var uploadPhotos= multer({ storage: photosStorage })

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

app.post('/fichesReflexe', uploadFichesReflexe.array('fichesReflexe'), function (req, res, next) {
    console.log(req.files);
    console.log(req.files['fichesReflexe']);

    // TODO : à tester
    // TODO : ajout BDD
});

app.post('/uploadPhoto', uploadPhotos.array('photos'), function (req, res, next) {
    console.log(req.files);
    console.log(req.files['photos']);

    var fileInfo = [];
    for(var i = 0; i < req.files.length; i++) {
        fileInfo.push({
            "originalName": req.files[i].originalName,
            "size": req.files[i].size,
            "b64": new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
        });
        fs.unlink(req.files[i].path);
    }
    res.send(fileInfo);
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

    /*
     * informations['numero']
     * informations['nomFichier']
     */
    socket.on('receptionImage', function (informations) {
        // TODO : à tester
        operatorsPool.foreach(function (operatorSocket) {
            operatorSocket.emit('receptionImageOperator', informations);
        })
    });

    socket.on('supprimerSession', function (informations) {
        // TODO : à tester
        delete victimsSockets[informations['numero']];
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});