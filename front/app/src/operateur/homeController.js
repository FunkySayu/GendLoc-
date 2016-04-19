(function() {

    angular
        .module('operateur')
        .controller('HomeController', HomeController);

    
    /**
     * Global home controller
     */
    function HomeController($scope, $mdDialog, UtilisateurService) {

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

        $scope.ajouterUtilisateur = function (numero) {
            var user = {
                phone: numero,
                state: "disconnected"
            };
            $scope.users.push(user);
            UtilisateurService.ajouterUtilisateur(user);
        };
        

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

