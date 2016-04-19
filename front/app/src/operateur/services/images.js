(function () {

    angular
        .module('operateur')
        .service('PhotoService', PhotoService);

    function PhotoService($q, $timeout) {

        var photos = [
            {
                date: "Tue Apr 19 18:02:29 UTC 2016",
                url: "assets/images/1.jpg",
                phone: "+336 80501815"
            },
            {
                date: "Tue Apr 19 18:04:20 UTC 2016",
                url: "assets/images/2.jpg",
                phone: "+336 01020304"
            },
            {
                date: "Tue Apr 19 18:05:45 UTC 2016",
                url: "assets/images/3.jpg",
                phone: "+336 80501815"
            }
        ];

        var recupererPhotoParTelephone = function (phone) {
            // TODO
            return $q.when(photos.filter(function (e) { return e.phone == phone; }));
        }

        return {
            recupererPhotoParTelephone: recupererPhotoParTelephone
        }
    }

})()
