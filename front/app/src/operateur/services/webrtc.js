(function() {
    angular
        .module('webrtc', [])
        .service('WebrtcService', WebrtcService);

    function WebrtcService() {

        var webrtc;

        var listenConnection = function (numero, callback) {
            webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: 'remotesVideos',
                // immediately ask for camera access
                autoRequestMedia: true
            });

            // we have to wait until it's ready
            webrtc.on('readyToCall', function () {

                console.log(numero);
                
                // you can name it anything
                webrtc.joinRoom(numero);

                if (callback) callback(webrtc);
            });
        };


        
        
        return {
            listenConnection: listenConnection
        }
        
    }


})();