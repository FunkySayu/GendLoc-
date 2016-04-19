angular
    .module('operateur')
    .service('UtilisateurService', UtilisateurService);

function UtilisateurService($q, $timeout) {

    var ajouterUtilisateur = function (user) {
        $q(function (resolve, reject) {

            $timeout(function () {
                user.state = "connected";
                resolve();
            }, 1000);

        });
    }

    return {
        ajouterUtilisateur: ajouterUtilisateur
    }
}
