'use strict';

angular.module('myApp.addchannel', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addchannel', {
    templateUrl: 'addchannel/addchannel.html',
    controller: 'AddChannel'
  });
}])

.controller('AddChannel', ['$rootScope', '$scope', '$window', '$log', '$http', '$timeout', '$sce', 'channel',
    function($rootScope, $scope, $window, $log, $http, $timeout, $sce, channel) {
      $scope.channel = channel

      $http({
          method : "GET",
          url : "http://localhost:8090/channellist"
      }).then(function mySuccess(response) {
          $log.log(response.data.result);
          $scope.channels = response.data.result;
      }, function myError(response) {
          $scope.error = response.statusText;
      });
      // $scope.$apply();

      $scope.updateChannel = function(item) {
        // $rootScope.plname = item.playlistName
        // $log.log($rootScope.plname);
        $window.localStorage.setItem("currentlyUpdating",item.channeltitle)
        // $scope.playlist.currentlyUpdating = item.playlistName
        $window.location.href = "/#!/updateplaylist"
      }

      $scope.previewImage = function(element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
          $scope.image_source = event.target.result
          $scope.$apply()

        }
        // when the file is read it triggers the onload event above.
        reader.readAsDataURL(element.files[0]);
      }

      $scope.saveImage = function(item) {
        item.image = $scope.image_source;
        $log.log(item);
        var data = item;
        $http({
            method : "POST",
            url : "http://localhost:8090/addchannel",
            data: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).then(function mySuccess(response) {
            $log.log(response);
            $window.location.reload();
        }, function myError(response) {
            $scope.error = response.statusText;
        });
        // $window.location.reload();  
      }

      $scope.deleteChannel = function(item) {
        var data = {"channeltitle":item.channeltitle}
        $log.log(data);
        $http({
            method : "POST",
            url : "http://localhost:8090/delete_channel",
            data: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).then(function mySuccess(response) {
            $log.log(response);
            $window.location.reload();
        }, function myError(response) {
            $scope.error = response.statusText;
        });
      }
    }
]);