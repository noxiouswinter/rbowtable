'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', ['ngResource']);

services.factory('Car', ['$resource',
  function($resource){
    return $resource('cars/:carId.json', {}, {
      getAll: {method:'GET', params:{carId:'cars-model'}, isArray:false}
    });
  }]);

