(function() {
    angular
        .module('transmission')
        .controller('TransmissionController', TransmitionController);

    function TransmitionController($mdSidenav, $scope, $routeParams, WebrtcService, WebsocketCallbackService) {

        WebsocketCallbackService.init();

        var telephone = $routeParams.telephone;

        WebrtcService.listenConnection(telephone);

    }
})();