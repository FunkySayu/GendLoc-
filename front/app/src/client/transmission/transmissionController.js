angular
    .module('transmission')
    .controller('TransmissionController', TransmitionController);

function TransmitionController($mdSidenav, $scope, $routeParams, WebrtcService) {

    var telephone = $routeParams.telephone;

    WebrtcService.listenConnection(telephone);
    

}