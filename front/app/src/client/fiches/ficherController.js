(function() {
    angular
        .module('fiches', [])
        .controller('FicheController', FicheController);

    function FicheController($scope, $routeParams, WebsocketCallbackService) {
        WebsocketCallbackService.init();
        $scope.lien = $routeParams.lien;
    }
})();