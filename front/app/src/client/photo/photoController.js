angular
    .module('photo')
    .controller('PhotoController', PictureController);

function PictureController($scope) {

	var video,
	videoObj,
	errBack = function(error) {
		console.log("Video capture error: ", error.code); 
	};

	function detect_safari() {}
		var ua = navigator.userAgent.toLowerCase(); 
		if (ua.indexOf('safari') > 0)
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

	document.getElementById("snap").addEventListener("click", function() {
		context.drawImage(video, 0, 0, 640, 480);
	});
}