(function () {
    'use strict';

    angular
        .module('app', [
            'ngRoute'
        ])
        .config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('');
            $routeProvider
                .when('/', {
                    controller: 'loginCtrl',
                    templateUrl: '/app/templates/login.html' // Add the login template here
                })
                .when('/dashboard', {
                    templateUrl: '/app/templates/dashboard.html'
                })
                .when('/users', {
                    controller: 'userCtrl',
                    templateUrl: '/app/templates/user.html'
                })
                .when('/adduser', {
                    controller: 'userAddCtrl',
                    templateUrl: '/app/templates/userAdd.html'
                })
                .when('/edituser/:id', {
                    controller: 'userEditCtrl',
                    templateUrl: '/app/templates/userEdit.html'
                })
                .otherwise({ redirectTo: '/' });
        }]);
})();