var PORT = 8080;
if (process.argv[2]) {
    PORT = process.argv[2];
}

var main = require('express')();
var http = require('http');
var sugar = require('sugar');
var bodyParser = require('body-parser');
main.use(bodyParser.urlencoded({extended: true}));
var server = http.createServer(main);
var io = require('socket.io').listen(server);
var fs = require('fs');
var uuid = require('node-uuid');

var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};

main.get('/', function (req, res) {
    res.sendFile('views/client.html', options);
});

main.get('/css/:source', function (req, res) {
    res.sendFile("css/" + req.params.source, options);
});
main.get('/fonts/:source', function (req, res) {
    res.sendFile("fonts/" + req.params.source, options);
});
main.get('/js/:source', function (req, res) {
    res.sendFile("js/" + req.params.source, options);
});
main.get('/views/:source', function (req, res) {
    res.sendFile("views/" + req.params.source, options);
});

main.post('/signup', function (req, res) {
    clearTokens();
    //if (req.body.username !== "" && req.body.password !== "") {
    if (req.body.username !== "") {
        var db = new sqlite3.Database(dbFile);
        var rand = uuid.v4();
        db.run("INSERT INTO `users` VALUES (?, ?, ?)", req.body.username, req.body.username, req.body.username, function (err) {
            //db.run("INSERT INTO `users` VALUES (?, ?, ?)", req.body.username, "Victime n°" + rand, req.body.username, function (err) {
            if (err !== null) {
                res.send({err: 2, message: 'Username already exists'});
            } else {
                var token = uuid.v4();
                res.send({err: 0, message: req.body.username, token: token});
                //res.send({err: 0, message: "Victime n°" + rand, token: token});
                db.run("INSERT INTO `tokens` VALUES (?, ?, ?, ?)", this.lastID, token, parseInt(Date.now() / 1000, 10), req.body.username);
                //db.run("INSERT INTO `tokens` VALUES (?, ?, ?, ?)", this.lastID, token, parseInt(Date.now() / 1000, 10), "Victime n°" + rand);
            }
        });

        db.close();
    } else {
        res.send({err: 1, message: 'Not valid data'});
    }
});

main.post('/signin', function (req, res) {
    clearTokens();
    var db = new sqlite3.Database(dbFile);
    // TODO : pass same as username
    db.all("SELECT * FROM users WHERE id=(?) AND password=(?)", req.body.username, req.body.username, function (err, rows) {
        if (rows !== null && rows !== undefined && rows.length !== 0) {
            var token = uuid.v4();
            res.send({err: 0, message: rows[0].username, token: token});
            db.run("DELETE FROM `tokens` WHERE idUser=?", rows[0].id);
            db.run("INSERT INTO `tokens` VALUES (?, ?, ?, ?)", rows[0].id, token, parseInt(Date.now() / 1000, 10), rows[0].username);
        } else {
            res.send({err: 1, message: "Wrong login"});
        }
    });

    db.close();
});

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

var listChannels = null;
if (fileExists(__dirname + '/serverRooms.json')) {
    listChannels = require(__dirname + '/serverRooms.json');
} else {
    listChannels = require(__dirname + '/defaultRooms.json');
}

/** Database conf **/
var dbFile = __dirname + "/zazu.db";
var dbExists = fileExists(dbFile);

if (!dbExists) {
    console.log("Creating DB SQLite file.");
    fs.openSync(dbFile, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(dbFile);

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS `users`(" +
        "`id` VARCHAR(40) UNIQUE NOT NULL PRIMARY KEY," +
        "`username` VARCHAR(40) UNIQUE NOT NULL," +
        "`password` VARCHAR(40) NOT NULL" +
        ")");

    db.run("CREATE TABLE IF NOT EXISTS `tokens`(" +
        "`idUser` VARCHAR(40) NOT NULL," +
        "`token` VARCHAR(40) NOT NULL," +
        "`date` INT(16)," +
        "`username` VARCHAR(40) NOT NULL " +
        ")");

    db.run("PRAGMA journal_mode = WAL;");

    db.each("SELECT * FROM users", function (err, row) {
        console.log(row.id + "|" + row.username + "|" + row.password);
    });

    db.each("SELECT * FROM tokens", function (err, row) {
        console.log(row.idUser + "|" + row.token + "|" + row.date);
    });
});

db.close();

function clearTokens() {
    var db = new sqlite3.Database(dbFile);
    db.run("DELETE FROM `tokens` WHERE date<?", parseInt(Date.now() / 1000, 10) - 20);
    db.close();
}

/** Database conf **/

//console.log(listChannels);
var DEFAULT_CHANNEL = listChannels[0].id;
server.listen(PORT, null, function () {
    console.log("Listening on port " + PORT);
});

var channels = listChannels;
var sockets = {};
var names = {};
console.log(channels);
io.sockets.on('connection', function (socket) {
    var token = socket.handshake.query.token
    if (token === undefined) {
        console.log("IP : '" + socket.handshake.address + "' tried to connect without token");
        socket.disconnect();
    } else {
        clearTokens();
        var db = new sqlite3.Database(dbFile);
        db.all("SELECT * FROM `tokens` WHERE token=?", token, function (err, rows) {
            if (rows.length !== 0) {
                socket.emit('tokenAccepted');
                socket.idUser = rows[0].idUser;
                socket.name = rows[0].username;

                socket.channel = null;
                socket.microphone_ok = socket.handshake.query.microphone_ok;
                sockets[socket.id] = socket;
                console.log("[" + socket.id + "] connection accepted");

                names[socket.id] = outputText(socket.name.stripTags());

                // for (id in sockets) {
                //     sockets[id].emit('listNames', names);
                //     sockets[id].emit("msgReceived", {code: "connect", author_id: socket.id, date: getTimestamp()})
                // }

                socket.on('hasConnected', function () {
                    for (id in sockets) {
                        sockets[id].emit('listNames', names);
                        sockets[id].emit("msgReceived", {
                            code: "connect",
                            author_id: socket.id,
                            date: getTimestamp()
                        });
                    }

                    joinServer(null);
                });

                function getTimestamp() {
                    return parseInt(Date.now() / 1000, 10);
                }

                function printChannels(channels) {
                    var res = "";
                    if (Array.isArray(channels)) {
                        res += "[\n";
                        for (var i = 0; i < channels.length; i++) {
                            var tmp = Object.extended(channels[i]).clone(); // Obligé pour ne pas modifier le channel.sockets original
                            tmp = Object.select(tmp, ['id', 'name', 'description', 'father']);
                            tmp.sockets = [];
                            if (i != channels.length - 1) res += JSON.stringify(tmp) + ",\n";
                            else res += JSON.stringify(tmp) + "\n";
                        }
                        res += "]";
                        return res;
                    } else {
                        res = "Error on argument channels :";
                        res += channels.toString();
                        return res;
                    }

                }

                function saveRoomsToJson() {
                    var outputJson = __dirname + "/serverRooms.json";
                    fs.writeFile(outputJson, printChannels(channels), function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("JSON saved to " + outputJson);
                        }
                    });
                }

                function replaceURL(text) {
                    var exp = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
                    return text.replace(exp, "<a href='$1'>$1</a>");
                }

                function outputText(text) {
                    return replaceURL(text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'));
                }

                socket.on('disconnect', function () {
                    part(socket.channel);
                    console.log("[" + socket.id + "] disconnected");
                    for (id in sockets)
                        sockets[id].emit("msgReceived", {
                            code: "disconnect",
                            author_id: socket.id,
                            date: getTimestamp()
                        })
                    delete sockets[socket.id];
                    delete names[socket.id];
                });

                function join(channel) {
                    console.log("[" + socket.id + "] try to join '" + channel + "'");
                    if (channels[channel]) {
                        if (channel === socket.channel) {
                            console.log("[" + socket.id + "] ERROR: already joined " + channel);
                            return;
                        } else {
                            if (socket.channel !== null) part(socket.channel);
                            socket.channel = channel;
                            console.log("[" + socket.id + "] joined '" + channel + "'");
                            socket.emit('joinSuccess', channel);
                            socket.emit('msgReceived', {
                                code: "moveSelf",
                                content: channels[channel].name,
                                date: getTimestamp()
                            });
                        }

                        for (id in channels[channel].sockets) {
                            sockets[channels[channel].sockets[id]].emit('addPeer', {
                                'peer_id': socket.id,
                                'should_create_offer': false
                            });
                            socket.emit('addPeer', {
                                'peer_id': channels[channel].sockets[id],
                                'should_create_offer': true
                            });
                            sockets[channels[channel].sockets[id]].emit('msgReceived', {
                                code: "moveChannelIn",
                                author_id: socket.id,
                                date: getTimestamp()
                            });
                        }

                        channels[channel].sockets.add(socket.id);

                        for (id in sockets)
                            sockets[id].emit('listChannels', channels);
                    } else {
                        console.log("[" + socket.id + "] ERROR: channel '" + channel + "' doesn't exist");
                    }
                }

                socket.on('join', join);

                function part(channel) {
                    console.log("[" + socket.id + "] try to part '" + channel + "'");
                    if (channels[channel]) {
                        console.log("[" + socket.id + "] part '" + channel + "'");
                        if (!(channel === socket.channel)) {

                            console.log("[" + socket.id + "] ERROR: not in ", channel);
                            console.log("only in " + socket.channel);
                            return;
                        }
                        delete socket.channel;
                        channels[channel].sockets.remove(socket.id);
                        for (id in channels[channel].sockets) {
                            sockets[channels[channel].sockets[id]].emit('removePeer', {
                                'peer_id': socket.id
                            });
                            sockets[channels[channel].sockets[id]].emit('msgReceived', {
                                code: "moveChannelOut",
                                author_id: socket.id,
                                date: getTimestamp()
                            });
                        }
                        for (id in sockets)
                            sockets[id].emit('listChannels', channels);
                    } else {
                        console.log("[" + socket.id + "] ERROR: channel '" + channel + "' doesn't exist");
                    }
                }

                socket.on('part', part);

                /*socket.on('msgSent', function (msg) {
                 switch (msg.code) {
                 case "channel":
                 console.log("[" + socket.id + "] send '" + encodeURI(msg.content) + "' to '" + socket.channel + "'");
                 for (id in channels[socket.channel].sockets) {
                 sockets[channels[socket.channel].sockets[id]].emit('msgReceived', {
                 'code': 'channel',
                 'content': outputText(msg.content),
                 'author_id': socket.id,
                 'date': getTimestamp()
                 })
                 }
                 break;
                 case "channelDistant":
                 console.log("[" + socket.id + "] send '" + encodeURI(msg.content) + "' to '" + channels[msg.id].name + "'");
                 for (id in channels[msg.id].sockets) {
                 sockets[channels[msg.id].sockets[id]].emit('msgReceived', {
                 'code': 'channel',
                 'content': outputText(msg.content),
                 'author_id': socket.id,
                 'date': getTimestamp()
                 });
                 }
                 if (channels[msg.id].sockets.indexOf(socket.id) == -1) {
                 socket.emit('msgReceived', {
                 'code': 'channelOut',
                 'content': outputText(msg.content),
                 'channel': msg.id,
                 'date': getTimestamp()
                 })
                 }
                 break;
                 case "private":
                 console.log("[" + socket.id + "] send '" + encodeURI(msg.content) + "' to [" + msg.receiver_id + "]");
                 if (sockets[msg.receiver_id]) {
                 sockets[msg.receiver_id].emit('msgReceived', {
                 'code': 'privateIn',
                 'content': outputText(msg.content),
                 'author_id': socket.id,
                 'date': getTimestamp()
                 });
                 socket.emit('msgReceived', {
                 'code': 'privateOut',
                 'content': outputText(msg.content),
                 'receiver_id': msg.receiver_id,
                 'date': getTimestamp()
                 });
                 } else {
                 console.log("[" + socket.id + "] can't find the receiver [" + msg.receiver_id + "]");
                 }
                 break;
                 }
                 });*/

                /*socket.on('editChannel', function (edit) {
                 console.log("[" + socket.id + "] change channel of id '" + edit.id + "'");
                 outputName = outputText(edit.channel.name.stripTags());
                 outputDescription = outputText(edit.channel.description.stripTags());
                 var nameChanged = (channels[edit.id].name !== outputName);
                 var descChanged = (channels[edit.id].description !== outputDescription);

                 if (descChanged) {
                 channels[edit.id].name = outputName;
                 channels[edit.id].description = outputDescription;

                 for (id in sockets)
                 sockets[id].emit('listChannels', channels);
                 } else if (nameChanged) {
                 channels[edit.id].name = outputName;

                 for (id in sockets)
                 sockets[id].emit("localChange", {
                 code: "channel",
                 channel_id: edit.id,
                 name: outputName
                 });
                 }

                 saveRoomsToJson();
                 });*/

                function joinServer(channel) {
                    console.log(socket.channel);
                    if (socket.idUser != "ope") {
                        // TODO : attention l'user non ope ne peut pas rejoindre un channel par choix
                        addChannel({
                            name: socket.idUser,
                            father: null
                        });
                        /*signaling_socket.emit('addChannel', {
                         name: phoneNumber,
                         father: null
                         });*/
                    } else {
                        if (socket.channel == null || channel == null) {
                            join(DEFAULT_CHANNEL);
                            //signaling_socket.emit('join', channel);
                        } else {
                            join(channel);
                        }
                    }
                }
                socket.on('joinServer', joinServer);

                function addChannel(channel) {
                    //console.log("[" + socket.id + "] add a channel '" + channel.name + "' in channel '" + channels[channel.father].name + "'");
                    newChannelId = channels.max(function (n) {
                            return n.id
                        }).id + 1;

                    var existingChannel = channels.filter(function (currentChannel) {
                        return currentChannel.name == outputText(channel.name.stripTags());
                    });

                    console.log(existingChannel);
                    var idChannelToJoin;
                    if (existingChannel.length <= 0) {
                        channels.add({
                            "id": newChannelId,
                            "name": outputText(channel.name.stripTags()),
                            "sockets": [],
                            "father": channel.father
                        });

                        for (id in sockets)
                            sockets[id].emit('listChannels', channels);
                        saveRoomsToJson();
                        idChannelToJoin = newChannelId;
                    } else {
                        console.log("[" + socket.id + "] ERROR: channel '" + channel + "' already created, joining.");
                        idChannelToJoin = existingChannel[0].id
                    }
                    join(idChannelToJoin);

                }

                socket.on('addChannel', addChannel);


                socket.on('getListChannelsAndNames', function () {
                    socket.emit('listNames', names);
                    socket.emit('listChannels', channels);
                });

                //listChannelsInterval = setInterval(sendListChannels, 1000);

                /*socket.on('muted', function() {
                 for (peer in sockets) {
                 sockets[peer].emit('muted', {
                 'peer_id': socket.id
                 });
                 }
                 })

                 socket.on('unmuted', function() {
                 for (peer in sockets) {
                 sockets[peer].emit('unmuted', {
                 'peer_id': socket.id
                 });
                 }
                 })

                 socket.on('deafen', function() {
                 for (peer in sockets) {
                 sockets[peer].emit('deafen', {
                 'peer_id': socket.id
                 });
                 }
                 })

                 socket.on('undeafen', function() {
                 for (peer in sockets) {
                 sockets[peer].emit('undeafen', {
                 'peer_id': socket.id
                 });
                 }
                 })*/

                socket.on('relayICECandidate', function (config) {
                    var peer_id = config.peer_id;
                    var ice_candidate = config.ice_candidate;
                    ///console.log("[" + socket.id + "] relaying ICE candidate to [" + peer_id + "] ", ice_candidate);

                    if (peer_id in sockets) {
                        sockets[peer_id].emit('iceCandidate', {
                            'peer_id': socket.id,
                            'ice_candidate': ice_candidate
                        });
                    }
                });

                socket.on('relaySessionDescription', function (config) {
                    var peer_id = config.peer_id;
                    var session_description = config.session_description;
                    //console.log("[" + socket.id + "] relaying session description to [" + peer_id + "] ", session_description);

                    if (peer_id in sockets) {
                        sockets[peer_id].emit('sessionDescription', {
                            'peer_id': socket.id,
                            'session_description': session_description
                        });
                    }
                });
            }
            else {
                console.log("IP : '" + socket.handshake.address + "' tried to connect with invalid token : " + token);
                socket.disconnect();
            }
        });
        db.close();
    }
})
;
