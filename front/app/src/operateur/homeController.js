(function() {

    angular
        .module('operateur')
        .controller('HomeController', HomeController);

    
    /**
     * Global home controller
     */
    function HomeController($scope, $mdDialog, UtilisateurService, WebrtcService) {

        $scope.users = [ ];
        $scope.selected = undefined;
        $scope.images = [ ];
        $scope.fiches = [ ];


        // XXX: for debug purpose only
        for (var i = 0; i < 1; ++i) {
            $scope.images.push({
                    url: "http://www.batirama.com/images/article/3074-reglementation-incendie-2.jpg",
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

        $scope.demanderVideo = function () {
            if (!$scope.selected) return;

            WebrtcService.listenConnection($scope.selected.numero, function(webrtc) {
                console.log("client connecté");
            });
        };

        // XXX: for debug purpose only
        for (i = 0; i < 10; ++i) {
            $scope.fiches.push({
                name: "Une fiche reflexe",
                keywords: ["toto", "lulz", "lmao"],
                url: "assets/fiches/pollution.jpg"
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
                controller: ImageDialogController
            });
        };

        $scope.selectUser = function (user) {
            $scope.selected = user;
        }
    }

    /**
     * Image popup controller
     */
    function ImageDialogController($scope, $mdDialog, image) {
        $scope.image = image;

        $scope.closeDialog = function () {
            $mdDialog.hide();
        }
    }

    /**
     * "Fiche reflex" controller
     */
    /*
    function FicheReflexDialocController($scope, $mdDialog, user, fiches) {
        $scope.user = user;
        $scope.fiches = fiches;
        $scope.keywords = [];

        var i, j;
        for (i = 0; i < $scope.fiches.length(); ++i) {
            for (j = 0; j < $scope.fiches[i].keywords.length(); ++j) {
                if ($scope.keywords.indexOf($scope.fiches[i].keywords[j]) == -1)
            }
        }
    }
    */
})();

