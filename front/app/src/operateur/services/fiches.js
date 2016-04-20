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
                url: "pollution.jpg"
            },
            {
                name: "Une fiche reflexe 2",
                keywords: ["lulz"],
                url: "pollution.jpg"
            },
            {
                name: "Une fiche reflexe 3",
                keywords: ["lulz", "lmao"],
                url: "pollution.jpg"
            }];

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
