angular
    .module('notification', [])
    .service('NotificationService', NotificationService);

function NotificationService() {

    var socket = io();

    var connect = function (numero, role) {
        if(!socket) return;
        socket.emit('connection', {
            numero: numero,
            role: role
        });
    };

    var setCallback = function (callback) {
        if(!socket) return;
        socket.onmessage = function (data) {
            if (callback) callback(data);
        }
    };

    return {
        connect: connect
    }
}