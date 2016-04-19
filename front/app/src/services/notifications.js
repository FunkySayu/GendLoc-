angular
    .module('notification', [])
    .service('NotificationService', NotificationService);

function NotificationService() {

    var socket = io();


    var callback;

    var connect = function (numero, role) {
        if(!socket) return;
        socket.emit('authentification', {
            numero: numero,
            role: role
        });
    };

    var setCallback = function (callback) {
        if(!socket) return;

    };

    return {
        connect: connect
    }
}