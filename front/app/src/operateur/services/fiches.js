(function () {

    angular
        .module('operateur')
        .service('FicheService', FicheService);

    function FicheService($q, $timeout) {

        // XXX: for debug purpose only
        var fiches = [
            {
                name: "Une fiche reflexe 1",
                keywords: ["toto", "lulz", "lmao"],
                url: "assets/fiches/pollution.jpg"
            },
            {
                name: "Une fiche reflexe 2",
                keywords: ["lulz"],
                url: "assets/fiches/pollution.jpg"
            },
            {
                name: "Une fiche reflexe 3",
                keywords: ["lulz", "lmao"],
                url: "assets/fiches/pollution.jpg"
            }]

        var recupererFiches = function () {
            return $q.when(fiches);
        }

        return {
            recupererFiches: recupererFiches
        }
    }

})();
