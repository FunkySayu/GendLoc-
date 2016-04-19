(function () {

    angular
        .module('operateur')
        .service('FicheService', FicheService);

    function FicheService($q, $timeout, $http) {

        var ajouterFiche = function (fiche) {
            // TODO : POST "fichesReflexe"
        };

        var recupererFiches = function () {
            return $http.get('../fichesReflexe');
            //return $q.when(fiches);
        };

        return {
            ajouterFiche: ajouterFiche,
            recupererFiches: recupererFiches
        }
    }

})();
