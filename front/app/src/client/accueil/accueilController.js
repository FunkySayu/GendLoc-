(function(){

    angular
        .module('accueil')
        .controller('AccueilController', AccueilController);


    function AccueilController(WebsocketCallbackService) {
        WebsocketCallbackService.init();
    }

})();
