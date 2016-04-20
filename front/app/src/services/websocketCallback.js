(function() {
    angular
        .module('notification')
        .service('WebsocketCallbackService', WebsocketCallbackService);

    function WebsocketCallbackService($mdBottomSheet, NotificationService, $routeParams) {

        var initialisation = function() {

            if (!$routeParams.telephone) {
                $routeParams.telephone = "0645854712"
            }

            NotificationService.connect($routeParams.telephone, "victime");

            NotificationService.setCbVideo(function () {
                $mdBottomSheet.show({
                    templateUrl: 'src/client/accueil/bottomSheet/video.html',
                    controller: function ($scope, $mdBottomSheet) {
                        $scope.fermer = function () {
                            $mdBottomSheet.hide();
                        }
                    }
                });
            });

            NotificationService.setCbPhoto(function () {
                $mdBottomSheet.show({
                    templateUrl: 'src/client/accueil/bottomSheet/photo.html',
                    controller: function ($scope, $mdBottomSheet) {
                        $scope.fermer = function () {
                            $mdBottomSheet.hide();
                        }
                    }
                });
            });

            NotificationService.setCbTexte(function (lienFiche) {
                $mdBottomSheet.show({
                    templateUrl: 'src/client/accueil/bottomSheet/reflexe.html',
                    locals: {
                        lienFiche: lienFiche
                    },
                    controller: function ($scope, $mdBottomSheet, lienFiche) {
                        $scope.lien = lienFiche;
                        $scope.fermer = function () {
                            $mdBottomSheet.hide();
                        }
                    }
                });
            });

            initialized = true;
        };

        var initialized = false;

        var init = function () {
            if (!initialized) initialisation();
        };

        return {
            init: init
        };
    }
})();