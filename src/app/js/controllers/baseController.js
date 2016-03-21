(function(){
'use strict';

angular.module('teslaBase')
    .controller('baseController', ['userSession', baseController]);

    function baseController (userSession) {
        var vm = this;

        vm.currentUser = '';

        vm.initialize = initialize;
        vm.logout = logout;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            userSession.redirectIfLoggedIn();
            vm.currentUser = userSession.getUser();
        }

        function logout () {
            userSession.logout();
        }
    }
}());