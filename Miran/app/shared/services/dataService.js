(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataService', ['$http', '$q', function ($http, $q) {
            var service = {};

            //get
            service.getUsers = function () {
                var deferred = $q.defer();
                $http.get('/User/Index').then(function (result) {
                    deferred.resolve(result.data);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            //getById
            service.getUsersById = function (id) {
                var deferred = $q.defer();
                $http.get('/User/Details/' + id).then(function (result) {
                    deferred.resolve(result.data);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            //Add
            service.addUser = function (user) {
                var deferred = $q.defer();
                $http.post('/User/Create', user).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            //Update
            service.editUser = function (user) {
                var deferred = $q.defer();
                $http.post('/User/Edit', user).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            //Delete
            service.deleteUser = function (id) {
                var deferred = $q.defer();
                $http.post('/User/Delete', { id: id }).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            //import
            service.importUsers = function (excelJsonObj) {
                var deferred = $q.defer();
                $http.post('/User/Import', { users: excelJsonObj }).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };
            
            //Login
            service.login = function (loginData) {
                var deferred = $q.defer();
                $http.post('/User/Login', loginData).then(function (response) {
                    // Check if the login is successful, assuming response contains success status
                    if (response.data.success) {
                        deferred.resolve(response.data);  // Pass the response if successful
                    } else {
                        deferred.reject('Invalid credentials');  // Reject with an error message
                    }
                }, function () {
                    deferred.reject('Error in login');
                });
                return deferred.promise;
            };

            return service;
        }]);
})();