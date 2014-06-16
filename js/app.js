'use strict';

var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]);

// Declare app level module which depends on filters, and services etc
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cars', {templateUrl: 'partials/car-list.html', controller: 'CarListController'});
  $routeProvider.when('/cars/:carId', {templateUrl: 'partials/car-detail.html', controller: 'CarDetailController'});
  $routeProvider.otherwise({redirectTo: '/cars'});        
}]);