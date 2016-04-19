(function () {

    angular
        .module('operateur')
        .service('FicheService', FicheService);

    function FicheService($q, $timeout) {

        // XXX: for debug purpose only

        var ajouterFiche = function (fiche) {
            // TODO : POST "fichesReflexe"
        };

        var recupererFiches = function () {
            // TODO : GET "fichesReflexe"
            return;
            //return $q.when(fiches);
        };

        return {
            ajouterFiche: ajouterFiche,
            recupererFiches: recupererFiches
        }
    }

})();
