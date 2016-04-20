angular
    .module('photo')
    .controller('PhotoController', PictureController);

function PictureController($scope, PhotoService) {

    $scope.safariData = undefined;
    $scope.photo = undefined;

    $scope.isSafari = navigator.userAgent.indexOf('Safari') != -1 &&
        navigator.userAgent.indexOf('Chrome') == -1;

    function errorCallback(error) {
        console.log("Video capture error: ", error.code);
    }

    $scope.loadVideoStream = function () {
        console.log("Hello");
        var video = document.getElementById("photo");
        var videoObj = { video: true };

        // Put video listeners into place
        // FIXME: à tester full navigateur
        if (navigator.getUserMedia) { // Standard
            navigator.getUserMedia(videoObj, function(stream) {
                video.setAttribute('src', window.URL.createObjectURL(stream));
                video.play();
            }, errorCallback);
        } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia(videoObj, function(stream){
                video.setAttribute('src', window.webkitURL.createObjectURL(stream));
                video.play();
            }, errorCallback);
        }
        else if (navigator.mediaDevices.getUserMedia) { // Firefox-prefixed
            navigator.mediaDevices.getUserMedia(videoObj, function(stream){
                video.setAttribute('src', window.URL.createObjectURL(stream));
                video.play();
            }, errorCallback);
        }
    }

    function send() {
        console.log($scope.photo); // TODO
    }

    /** Trigger the click evvent on the snap button **/
    $scope.takePicture = function () {
        var canvas = document.getElementById("canvas");
        var video = document.getElementById("photo");
        var context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, 640, 480);
        $scope.photo = canvas.toDataURL("image/png");

        send();
    }

    $scope.submitSafari = function () {
        if (safariData && safariData[0]) {
            var fr = new FileReader();

            fr.onload = function (e) {
                $scope.photo = e.target.result;
                send();
            }
            fr.readAsDataURL(safariData[0]);
        }
    }

}
