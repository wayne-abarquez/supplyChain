(function(){
'use strict';

angular.module('teslaBase')
    .factory('userSession', ['TESLA_USERS', 'localStorageService', '$state', userSession]);

    function userSession (TESLA_USERS, localStorageService, $state) {
        var service = {};

        service.authenticate = authenticate;
        service.redirectIfLoggedIn = redirectIfLoggedIn;
        service.loginUser = loginUser;
        service.logout = logout;
        service.getUser = getUser;
        service.isLoggedIn = isLoggedIn;

        function authenticate(username, password) {
            var isAuthenticated = false;
            TESLA_USERS.forEach(function (u) {
                if (u.username === username && u.password === password) {
                    isAuthenticated = true;
                    return;
                }
            });
            return isAuthenticated;
        }

        function redirectIfLoggedIn () {
            if(isLoggedIn()) {
                $state.go('home');
            }
        }

        function loginUser (user) {
            return localStorageService.set('currentUser', user.username);
        }

        function logout () {
            localStorageService.remove('currentUser');
            $state.go('login');
        }

        function getUser () {
            return localStorageService.get('currentUser');
        }

        function isLoggedIn () {
            return getUser() !== null;
        }

        return service;
    }
}());