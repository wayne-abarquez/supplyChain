(function(){
'use strict';

    var app = angular.module('teslaBase', [
        // Angular Modules
        'ui.router',
        'LocalStorageModule'
    ]);

    app.config(['$stateProvider', '$urlRouterProvider', configRoutes]);

    function configRoutes ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state('home', {
               url: '/',
               templateUrl: "templates/pages/home.html",
               controller: 'baseController',
               controllerAs: 'baseCtl'
            })
            .state('login', {
                url: '/login',
                templateUrl: "templates/pages/login.html",
                controller: 'loginController',
                controllerAs: 'loginCtl'
            });
    }

    app.config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('teslaDemo')
            .setStorageType('localStorage')
            .setNotify(false, false)
    });

    app.run(function ($rootScope, userSession, $state) {
        var statesThatRequireAuth = ['home'];
        var statesThatDoesntRequireAuth = ['login'];

        $rootScope.$on('$stateChangeStart', function (event, next, current) {
            /* Redirect to login page if user is not logged in */
            if (statesThatRequireAuth.indexOf(next.name) !== -1 && !userSession.isLoggedIn()) {
                event.preventDefault();
                $state.go('login');
            }
            /* Redirect to index if user is logged in */
            if (statesThatDoesntRequireAuth.indexOf(next.name) !== -1 && userSession.isLoggedIn()) {
                event.preventDefault();
                $state.go('home');
            }
        });
    });


}());