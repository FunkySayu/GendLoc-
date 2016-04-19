(function() {

    angular
        .module('operateur')
        .controller('HomeController', HomeController);

    /**
     * Global home controller
     */
    function HomeController($scope, $mdDialog, UtilisateurService, FicheService, WebrtcService) {

        $scope.users = [ ];
        $scope.selected = undefined;
        $scope.images = [ ];
        $scope.fiches = [ ];

        /** Chargement des données **/

        // XXX: for debug purpose only
        for (var i = 0; i < 1; ++i) {
            $scope.images.push({
                    url: "http://www.batirama.com/images/article/3074-reglementation-incendie-2.jpg",
                    date: "Tue Apr 19 01:33:27 UTC 2016"
                });
        }

        // Chargement asynchrone des fiches reflexe
        FicheService
            .recupererFiches()
            .then(function (fiches) {
                $scope.fiches = fiches;
            });

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

            WebrtcService.listenConnection($scope.selected.phone, function(webrtc) {
                console.log("client connecté");
            });
        };

        // XXX: for debug purpose only
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

        /**
         * Open a dialog for selecting the reflex sheet to send
         */
        $scope.showFiches = function () {
            $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: 'src/operateur/fichesPopup.html',
                locals: {
                    fiches: $scope.fiches,
                    user: $scope.selected
                },
                controller: FicheReflexDialogController
            })
        };

        $scope.selectUser = function (user) {
            $scope.selected = user;
            console.log($scope.selected);
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
    function FicheReflexDialogController($scope, $mdDialog, user, fiches) {
        $scope.user = user;
        $scope.fiches = fiches;
        $scope.keywords = [];
        $scope.selectedFiches = fiches;

        // md-autocomplete variables
        $scope.selected = [];
        $scope.searchText = null;
        $scope.autocompleteDemoRequireMatch = true;

        // Keywords initialization
        var i, j;
        for (i = 0; i < $scope.fiches.length; ++i)
            for (j = 0; j < $scope.fiches[i].keywords.length; ++j)
                if ($scope.keywords.indexOf($scope.fiches[i].keywords[j]) == -1)
                    $scope.keywords.push($scope.fiches[i].keywords[j]);

        /** Internal functions **/

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(keyword) {
                    return keyword.indexOf(lowercaseQuery) === 0;
                };
        }

        $scope.querySearch = function (query) {
            var results = query ? $scope.keywords.filter(createFilterFor(query)) : [];
            return results;
        }

        function updateSelected(chip, add) {
            var i, j;

            $scope.selectedFiches = $scope.fiches.filter(function (element) {
                for (var i = 0; i < $scope.selected.length; ++i) {
                    if (element.keywords.indexOf($scope.selected[i]) == -1 &&
                        $scope.selected[i] != chip)
                        return false;
                }

                return !add || element.keywords.indexOf(chip) != -1;
            });
        }

        $scope.transformChip = function (chip) {
            updateSelected(chip, true);
            return chip;
        }

        $scope.onRemove = function (chip) {
            updateSelected(chip, false);
            return chip
        }

        $scope.closeDialog = function () {
            $mdDialog.hide();
        }

        $scope.getFiches = function () {
            return $scope.fiches; // TODO
        }

        // TODO: Trigger d'exit : à binder sur l'envoie au servvice
        $scope.selectAndExit = function (f) {
            $mdDialog.hide();
        }
    }
})();

