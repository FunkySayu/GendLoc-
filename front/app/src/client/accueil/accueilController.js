(function(){

    angular
        .module('accueil')
        .controller('AccueilController', ['$mdBottomSheet', AccueilController]);


    function AccueilController($mdBottomSheet) {
        /*$mdBottomSheet.show({
            templateUrl: 'src/client/accueil/bottomNotification.html',
            disableBackdrop: true
        })*/
    }

})();
