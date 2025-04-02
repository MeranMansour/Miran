(function () {
    'use strict';

    angular
        .module('app')
        .directive('myInfoMsg', function () {
            return { templateUrl: "/app/templates/my-info-msg.html" }
        })
        .directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function () {
                        var file = element[0].files[0];
                        scope.$apply(function () {
                            modelSetter(scope, element[0].files[0]);

                            if (file) {
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    scope.$apply(function () {
                                        if (!scope.user) {
                                            scope.user = { ImagePath: "" };
                                        }
                                        scope.user.ImagePath = e.target.result;
                                        consoel.log(scope.user.ImagePath);
                                    });
                                };
                                reader.readAsDataURL(file);
                            }
                        });
                    });
                }
            };
        }])
     
        .controller('userCtrl', ['$scope', 'dataService', '$filter', function ($scope, dataService, $filter) {
            $scope.users = [];

            getData();

            function getData() {
                dataService.getUsers().then(function (result) {
                    $scope.users = result;
                });
            }

            $scope.deleteUser = function (id) {
                if (window.confirm('Are you sure you want to delete this user?')) {
                    dataService.deleteUser(id).then(function () {
                        toastr.success('User deleted successfuly');
                        getData();
                    }, function () {
                        toastr.error('Error in deleting user with Id: ' + id);
                    });
                }
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
        .controller('userAddCtrl', ['$scope', '$location', 'dataService', '$http', function ($scope, $location, dataService, $http) {
            $scope.triggerFileInput = function () {
                document.getElementById('fileInput').click();
            };
            $scope.createUser = function (user) {
                dataService.addUser(user, $scope.imageFile).then(function () {
                    toastr.success('User created successfully');
                    $location.path('/users');
                }, function () {
                    toastr.error('Error in creating user');
                });
                
            };
           
        }])

        .controller('userEditCtrl', ['$scope', '$routeParams', '$location', 'dataService', function ($scope, $routeParams, $location, dataService) {
            $scope.triggerFileInput = function () {
                document.getElementById('fileInput').click();
            };
            $scope.user = {};
            debugger;
            dataService.getUsersById($routeParams.id).then(function (result) {
                $scope.user = result;
            }, function () {
                toastr.error('Error in fetching user with Id: ' + $routeParams.id);
            });
            $scope.updateUser = function (user) {
                dataService.editUser(user, $scope.imageFile).then(function () {
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