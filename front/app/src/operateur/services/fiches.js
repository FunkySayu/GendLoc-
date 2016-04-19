(function () {

    angular
        .module('operateur')
        .service('FicheService', FicheService);

    function FicheService($q, $timeout) {

        // XXX: for debug purpose only

        var recupererFiches = function () {
            return $q.when(fiches);
        };

        return {
            recupererFiches: recupererFiches
        }
    }

})();
