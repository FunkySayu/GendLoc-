(function() {

    angular
        .module('operateur')
        .controller('HomeController', HomeController);

    /**
     * Global home controller
     */
    function HomeController($scope, $mdDialog) {

        $scope.users = [ ];
        $scope.selected = null;
        $scope.images = [ ];

        // XXX: for debug purpose only
        for (var i = 0; i < 10; ++i) {
            $scope.images.push({
                    url: "http://www.louisetzeliemartin.org/medias/images/chat-1.jpg",
                    date: "Tue Apr 19 01:33:27 UTC 2016"
                });
        }

        // XXX: for debug purpose only
        for (i = 0; i < 10; ++i) {
            $scope.users.push({
                name: "Test Lorem",
                phone: "+336 80 50 18 15"
            })
        }

        /** Internal functions **/

        /**
         * Open a dialog and show the full sized image
         */
        $scope.showImage = function (image) {
            $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: 'src/operateur/popup.html',
                locals: {
                    image: image
                },
                controller: PopupDialogController
            });
        };

        $scope.selectUser = function (user) {
            $scope.selected = user;
        }
    }

    /**
     * Image popup controller
     */
    function PopupDialogController($scope, $mdDialog, image) {
        $scope.image = image;

        $scope.closeDialog = function () {
            $mdDialog.hide();
        }
    }
})();

