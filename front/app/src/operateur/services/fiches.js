(function () {

    angular
        .module('operateur')
        .service('FicheService', FicheService);

    function FicheService($q, $timeout) {

        // XXX: for debug purpose only

        var ajouterFiche = function (fiche) {
            console.log("Heu... C'est pas fait !"); // TODO
        };

        var recupererFiches = function () {
            return $q.when(fiches);
        };

        return {
            ajouterFiche: ajouterFiche,
            recupererFiches: recupererFiches
        }
    }

})();
