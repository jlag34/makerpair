angular.module('makerpair.auth', [])

.controller('AuthController', function($scope, $window, $location, Auth){
  $scope.user = {};

  $scope.login = function(){
    Auth.login($scope.user)
  }




});