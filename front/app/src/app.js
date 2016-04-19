angular
    .module('starterApp', ['ngMaterial', 'accueil', 'transmission', 'toolbar', 'operateur', 'ngRoute', 'webrtc'])
    .config(function($mdThemingProvider, $mdIconProvider, $routeProvider){

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu"       , "./assets/svg/menu.svg"        , 24)
            .icon("share"      , "./assets/svg/share.svg"       , 24)
            .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
            .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
            .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
            .icon("phone"      , "./assets/svg/phone.svg"       , 512);
        

        $routeProvider.
        when('/client/', {
            templateUrl: 'src/client/accueil/accueil.html',
            controller: 'AccueilController'
        }).
        when('/client/transmission/:telephone', {
            templateUrl: 'src/client/transmission/transmission.html',
            controller: 'TransmissionController'
        }).
        when('/client/photo', {
            templateUrl: 'src/client/photo/photo.html'
        }).
        when('/client/fiches', {
            templateUrl: 'src/client/fiches/fiches.html'
        }).
        when('/home', {
            templateUrl: 'src/operateur/home.html',
            controller: 'HomeController'
        })
            .otherwise("/home")

    });
