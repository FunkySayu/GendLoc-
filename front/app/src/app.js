angular
    .module('starterApp', ['ngMaterial', 'accueil', 'transmission', 'toolbar', 'operateur', 'ngRoute', 'webrtc', 'notification', 'photo', 'fiches'])
    .config(function($mdThemingProvider, $mdIconProvider, $routeProvider){

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu"          , "./assets/svg/menu.svg"        , 24)
            .icon("share"         , "./assets/svg/share.svg"       , 24)
            .icon("google_plus"   , "./assets/svg/google_plus.svg" , 512)
            .icon("hangouts"      , "./assets/svg/hangouts.svg"    , 512)
            .icon("twitter"       , "./assets/svg/twitter.svg"     , 512)
            .icon("phone"         , "./assets/svg/phone.svg"       , 512)
            .icon("send"          , "./assets/svg/send.svg"        , 128)
            .icon("visibility"    , "./assets/svg/visibility.svg"  , 128)
            .icon("telephone-ok"  , "./assets/svg/telephone-ok.svg", 128)
            .icon("telephone-nope", "./assets/svg/telephone-nope.svg", 128);

        /*$mdThemingProvider.theme('default')
         .primaryPalette('brown')
         .accentPalette('red');*/

        $routeProvider.
        when('/client/:telephone?', {
            templateUrl: 'src/client/accueil/accueil.html',
            controller: 'AccueilController'
        }).
        when('/client/transmission/:telephone', {
            templateUrl: 'src/client/transmission/transmission.html',
            controller: 'TransmissionController'
        }).
        when('/client/photo/:telephone?', {
            templateUrl: 'src/client/photo/photo.html',
            controller: 'PhotoController'
        }).
        when('/client/fiches/:lien/:telephone?', {
            templateUrl: 'src/client/fiches/fiches.html',
            controller: 'FicheController'
        }).
        when('/home', {
            templateUrl: 'src/operateur/home.html',
            controller: 'HomeController'
        })
            .otherwise("/home")

    });
