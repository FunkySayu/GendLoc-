angular
    .module('fiches', [])
    .controller('FicheController', FicheController);

function FicheController($scope, $routeParams) {
    $scope.lien = $routeParams.lien;
}