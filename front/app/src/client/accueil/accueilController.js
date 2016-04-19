(function(){

    angular
        .module('accueil')
        .controller('AccueilController', AccueilController);


    function AccueilController($mdBottomSheet, $timeout) {
        $timeout(function() {
            $mdBottomSheet.show({
                templateUrl: 'src/client/accueil/bottomNotification.html',
                disableBackdrop: true,
                controller: function($scope, $mdBottomSheet) {
                    $scope.fermer = function () {
                        $mdBottomSheet.hide();
                    }
                }
            });
        }, 3000);

    }

})();
