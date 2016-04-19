angular
    .module('operateur')
    .service('UtilisateurService', UtilisateurService);

function UtilisateurService($q, $timeout) {

    var utilisateurs = [
        {
            phone: "+336 80501815",
            state: "connected"
        },
        {
            phone: "+336 01020304",
            state: "disconnected"
        }
    ];

    var recupererUtilisateurs = function () {
        // TODO
        // Simulation d'une requête assymétrique
        return $q.when(utilisateurs);
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
