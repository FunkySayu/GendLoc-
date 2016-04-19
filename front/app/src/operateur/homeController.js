(function() {

    angular
        .module('operateur')
        .controller('HomeController', HomeController);

    function HomeController($scope, $mdDialog) {

        $scope.images = [ ];

        for (var i = 0; i < 10; ++i) {
            $scope.images.push({
                    url: "http://www.louisetzeliemartin.org/medias/images/chat-1.jpg",
                    date: "Tue Apr 19 01:33:27 UTC 2016"
                });
        }

        $scope.showImage = function (image) {

            // TODO: traiter l'image
            $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: 'src/operateur/popup.html',
                locals: {
                    image: image
                },
                controller: function ($scope, image) {
                    $scope.image = image;
                }
            });
        };
    }

    function PopupDialogController($scope, $mdDialog, image) {
        $scope.image = image;

        $scope.closeDialog = function () {
        
        }
    }
})();

