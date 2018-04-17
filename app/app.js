'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.admin',
  'myApp.createplaylist',
  'myApp.editplaylist',
  'myApp.updateplaylist',
  'myApp.addvideo',
  'myApp.editvideo',
  'myApp.updatevideo',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/admin'});
}])
.factory("playlist",function(){
    return {};
})
.factory("video",function(){
    return {};
});
