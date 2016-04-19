(function() {

    angular
        .module('operateur')
        .controller('HomeController', HomeController);

    /**
     * Global home controller
     */
    function HomeController($scope, $mdDialog, UtilisateurService, PhotoService, FicheService, WebrtcService) {

        $scope.users = [ ];
        $scope.selected = undefined;
        $scope.images = [ ];
        $scope.fiches = [ ];
        $scope.videoActive = false;

        /** Chargement des données **/

        // Chargement asynchrone des fiches reflexe
        FicheService
            .recupererFiches()
            .then(function (fiches) {
                $scope.fiches = fiches;
            });

        // Chargement asynchrone des utilisateurs
        function chargerUtilisateurs() {
            UtilisateurService
                .recupererUtilisateurs()
                .then(function (users) {
                    $scope.users = users;
                });
        }
        chargerUtilisateurs();

        // Helper pour l'ajout d'un utilisateur
        $scope.ajouterUtilisateur = function (numero) {
            var user = {
                phone: numero,
                state: "disconnected"
            };
            UtilisateurService.ajouterUtilisateur(user);

            chargerUtilisateurs();
        };

        $scope.demanderVideo = function () {
            if (!$scope.selected) return;
            $scope.videoActive = true;
            $scope.videoEstablished = false;

            WebrtcService.listenConnection($scope.selected.phone, function(webrtc) {
            });
        };

        function chargerPhotoUtilisateur(user) {
            PhotoService.recupererPhotoParTelephone(user.phone)
                .then(function (photos) {
                    console.log(photos);
                    $scope.images = photos
                });
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

        /**
         * Open a dialog for adding the reflex sheet to send
         */
        $scope.addFiches = function () {
            $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: 'src/operateur/fichesAddPopup.html',
                controller: FicheReflexAjoutDialogController
            })
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

        function deleteCurrentUser() {
            console.log("++");
        }

        /**
         * Open a dialog for confirming the deletion
         */
        $scope.confirmerSuppression = function (ev) {
            var confirm = $mdDialog.confirm()
                .title("Voulez vous vraiment supprimer cette session ?")
                .textContent("Il vous sera impossible de ré-initialiser la session avec cet utilisateur.")
                .targetEvent(ev)
                .ok("Supprimer")
                .cancel("Annuler");

            $mdDialog.show(confirm).then(function() {
                UtilisateurService
                    .supprimerUtilisateur($scope.selected)
                    .then(function() {
                        chargerUtilisateurs();
                        $scope.selected = undefined;
                        $scope.videoActive = false;
                    });
            }, function () {});
        }


        $scope.selectUser = function (user) {
            $scope.selected = user;
            $scope.videoActive = false;
            chargerPhotoUtilisateur(user);
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

    /**
     * "Fiche reflex" controller
     */
    function FicheReflexAjoutDialogController($scope, $mdDialog, FicheService) {
        // md-autocomplete variables
        $scope.name = name;
        $scope.keywords = ["Urgence"];
        $scope.file = "idk";  //FIXME // TODO // XXX


        // TODO: Trigger d'exit : à binder sur l'envoie au servvice
        $scope.close = function (commit) {
            if (commit) {
                FicheService.ajouterFiche({
                    name: $scope.name,
                    keywords: $scope.keywords,
                    file: $scope.file
                })
            }
            $mdDialog.hide();
        }
    }

})();

