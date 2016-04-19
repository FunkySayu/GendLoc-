(function(){

    angular
        .module('accueil')
        .controller('AccueilController', AccueilController);


    function AccueilController($mdBottomSheet, NotificationService) {
        
        NotificationService.connect("0645854712", "victime");

        NotificationService.setCbVideo(function() {
            $mdBottomSheet.show({
                templateUrl: 'src/client/accueil/bottomVideoNotif.html',
                disableBackdrop: true,
                controller: function($scope, $mdBottomSheet) {
                    $scope.fermer = function () {
                        $mdBottomSheet.hide();
                    }
                }
            });
        });

        NotificationService.setCbPhoto(function() {
            $mdBottomSheet.show({
                templateUrl: 'src/client/accueil/bottomPhotoNotif.html',
                disableBackdrop: true,
                controller: function($scope, $mdBottomSheet) {
                    $scope.fermer = function () {
                        $mdBottomSheet.hide();
                    }
                }
            });
        });

        NotificationService.setCbTexte(function(lienFiche) {
            $mdBottomSheet.show({
                templateUrl: 'src/client/accueil/bottomTexteNotif.html',
                disableBackdrop: true,
                locals: {
                  lienFiche: lienFiche
                },
                controller: function($scope, $mdBottomSheet, lienFiche) {
                    $scope.lien = lienFiche;
                    $scope.fermer = function () {
                        $mdBottomSheet.hide();
                    }
                }
            });
        });


    }

})();
