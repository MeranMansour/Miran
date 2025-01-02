(function () {
    'use strict';

    angular
        .module('app')
        .controller('userCtrl', ['$scope', 'dataService', function ($scope, dataService) {
            $scope.users = [];

            getData();

            function getData() {
                dataService.getUsers().then(function (result) {
                    $scope.users = result;
                });
            }

            $scope.deleteUser = function (id) {
                dataService.deleteUser(id).then(function () {
                    toastr.success('User deleted successfuly');
                    getData();
                }, function () {
                    toastr.error('Error in deleting user with Id: ' + id);
                });
            };

            $scope.triggerFileDialog = function () {
                document.getElementById('file').click();
            };

            var excelJsonObj = [];
            $scope.importUsers = function (inputElement) {
                if (!inputElement.files || inputElement.files.length === 0) {
                    toastr.error('No file selected');
                    return;
                }

                var file = inputElement.files[0];
                var reader = new FileReader();
                reader.onload = function (event) {
                    var fileData = event.target.result;
                    var workbook = XLSX.read(fileData, { type: 'binary' });
                    workbook.SheetNames.forEach(function (sheetName) {
                        var rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        excelJsonObj = rowObject;
                    });

                    // Add the data to the database
                    $scope.$apply(function () {
                        dataService.importUsers(excelJsonObj).then(function () {
                            toastr.success('Users imported successfully');
                            getData();
                        }, function () {
                            toastr.error('Error in importing users');
                        });
                    });
                };
                reader.readAsBinaryString(file);
            };
            
        }])
        .controller('userAddCtrl', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
            $scope.createUser = function (user) {
                dataService.addUser(user).then(function () {
                    toastr.success('User created successfully');
                    $location.path('/users');
                }, function () {
                    toastr.error('Error in creating user');
                });
            };
        }])
        .controller('userEditCtrl', ['$scope', '$routeParams', '$location', 'dataService', function ($scope, $routeParams, $location, dataService) {
            $scope.user = {};
            dataService.getUsersById($routeParams.id).then(function (result) {
                $scope.user = result;
            }, function () {
                toastr.error('Error in fetching user with Id: ' + $routeParams.id);
            });
            $scope.updateUser = function (user) {
                dataService.editUser(user).then(function () {
                    toastr.success('User updated successfully');
                    $location.path('/users');
                }, function () {
                    toastr.error('error in updating user');
                })
            };
            
        }])

        // Add login controller
        .controller('loginCtrl', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
            $scope.loginData = {
                username: '',
                password: ''
            };

            $scope.login = function () {
                if ($scope.loginData.username && $scope.loginData.password) {
                    dataService.login($scope.loginData).then(function (response) {
                        if (response.success) {
                            toastr.success('Login successful');
                            $location.path('/dashboard');  // Redirect to the home page after successful login
                        } else {
                            toastr.error('Invalid credentials');
                        }
                    }, function () {
                        toastr.error('Error in login');
                    });
                } else {
                    toastr.warning('Please enter both username and password');
                }
            };
        }]);
})();