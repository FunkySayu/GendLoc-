(function() {
    angular
        .module('toolbar', [])
        .controller("ToolbarController", ToolbarController);

    function ToolbarController($scope, $mdSidenav) {

        $scope.toogleSidenav = function() {
            $mdSidenav('left').open();
        }

    }
})();
