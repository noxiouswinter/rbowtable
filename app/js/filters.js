'use strict';

/* Filters */

var filters = angular.module('myApp.filters', []);

filters.filter('myFilter', function(version) {
    return function(text) {
      return String(text + " Some extra content from myFilter" );
    };
  });
