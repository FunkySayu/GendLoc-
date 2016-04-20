angular
    .module('operateur')
    .service('UtilisateurService', UtilisateurService);

function UtilisateurService($http, $q, $timeout) {

    var utilisateurs = [
        {
            phone: "0645854712",
            state: "connected"
        },
        {
            phone: "0601020304",
            state: "disconnected"
        }
    ];

    var recupererUtilisateurs = function () {
        //return $q.when(utilisateurs);
        return $http.get('../connectedVictims');
    }

    var ajouterUtilisateur = function (user) {
        // TODO
        utilisateurs.push(user);
        $q(function (resolve, reject) {

            $timeout(function () {
                user.state = "connected";
                resolve();
            }, 3000);

        });
    };

    var supprimerUtilisateur = function (user) {
        // TODO
        return $q.when((function () {
            var i;

            for (i = 0; i < utilisateurs.length; ++i) {
                if (utilisateurs[i].phone == user.phone)
                    break
            }

            if (i < utilisateurs.length) {
                utilisateurs.splice(i, 1);
            }
        })());
    }

    return {
        recupererUtilisateurs: recupererUtilisateurs,
        ajouterUtilisateur: ajouterUtilisateur,
        supprimerUtilisateur: supprimerUtilisateur
    }
}
