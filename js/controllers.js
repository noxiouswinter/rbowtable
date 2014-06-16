'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);
controllers.controller('CarListController', ['$scope', 'Car', function($scope, Car){
        $scope.cars = Car.query();
}]);

controllers.controller('CarDetailController', ['$scope', '$routeParams', 'Car',
    function($scope, $routeParams, Car){
      $scope.car = Car.get({carId: $routeParams.carId}, function(car) {
      });
    }]);