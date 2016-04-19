angular
    .module('notification', [])
    .service('NotificationService', NotificationService);

function NotificationService() {

    var socket = io();

    var cbVideo = undefined;

    var setCbVideo = function (callback) {
        cbVideo = callback;
    };

    var connect = function (numero, role) {
        socket.emit('authentification', {
            numero: numero,
            role: role
        });
    };

    socket.on('demandeVideo', function (message) {
        if (cbVideo) cbVideo();
    });

    

    return {
        connect: connect,
        setCbVideo: setCbVideo
    }
}