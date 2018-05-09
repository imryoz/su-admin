'use strict';

var app = angular.module('myApp.adverts', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/advert', {
    templateUrl: 'adverts/adverts.html',
    controller: 'Adverts'
  });
}])

app.controller('Adverts', ['$rootScope', '$scope', '$window', '$log', '$http', '$timeout', '$sce',
    function($rootScope, $scope, $window, $log, $http, $timeout, $sce) {
      
    }
]);