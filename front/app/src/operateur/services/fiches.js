(function () {

    angular
        .module('operateur')
        .service('FicheService', FicheService);

    function FicheService($q, $timeout) {

        var ajouterFiche = function (fiche) {
            // TODO : POST "fichesReflexe"
        };

        var recupererFiches = function () {
            // TODO : GET "fichesReflexe"
            //return $q.when(fiches);
        };

        return {
            ajouterFiche: ajouterFiche,
            recupererFiches: recupererFiches
        }
    }

})();
