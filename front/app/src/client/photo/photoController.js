angular
    .module('photo')
    .controller('PhotoController', PictureController);

function PictureController($scope) {

	var video,
	videoObj,
	errBack = function(error) {
		console.log("Video capture error: ", error.code); 
	};

	function detect_safari() {
        if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)
            return true
        return false
	}

	$scope.onloadvideo = function(elem) {

		video = elem;
		videoObj = { "video": true };
				// Put video listeners into place
		if(navigator.getUserMedia) { // Standard
			navigator.getUserMedia(videoObj, function(stream) {
				video.src = stream;
				video.play();
			}, errBack);
		} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
			navigator.webkitGetUserMedia(videoObj, function(stream){
				video.src = window.webkitURL.createObjectURL(stream);
				video.play();
			}, errBack);
		}
		else if(navigator.mozGetUserMedia) { // Firefox-prefixed
			navigator.mozGetUserMedia(videoObj, function(stream){
				video.src = window.URL.createObjectURL(stream);
				video.play();
			}, errBack);
		}

	}

    $scope.videoUrl = undefined;
    $scope.isSafari = false;

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

    /** Trigger the click evvent on the snap button **/
    $scope.takePicture = function () {
        var canvas = document.getElementById("canvas");
        var video = document.getElementById("photo");
        var context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, 640, 480);
    }

}
