'use strict';

angular.module('myApp.editplaylist', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editplaylist', {
    templateUrl: 'editplaylist/editplaylist.html',
    controller: 'EditPlaylist'
  });
}])

.controller('EditPlaylist', ['$rootScope', '$scope', '$window', '$log', '$http', '$timeout', '$sce', 'playlist',
    function($rootScope, $scope, $window, $log, $http, $timeout, $sce, playlist) {
      $scope.playlist = playlist

      $http({
          method : "GET",
          url : "http://localhost:8090/getplaylistname"
      }).then(function mySuccess(response) {
          $scope.playlists = response.data.playlist;
      }, function myError(response) {
          $scope.error = response.statusText;
      });
      // $scope.$apply();

      $scope.updatePlaylist = function(item) {
        // $rootScope.plname = item.playlistName
        // $log.log($rootScope.plname);
        $window.localStorage.setItem("currentlyUpdating",item.playlistName)
        // $scope.playlist.currentlyUpdating = item.playlistName
        $window.location.href = "/#!/updateplaylist"
      }
      $scope.deletePlaylist = function(item) {
        var data = {"playlistName":item.playlistName}
        $http({
            method : "POST",
            url : "http://localhost:8090/delete_playlist",
            data: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).then(function mySuccess(response) {
            $log.log(response);
            $window.location.reload();
        }, function myError(response) {
            $scope.error = response.statusText;
        });
        // results["genre"] = $scope.genre;
        // results["playlistName"] = $scope.name;
        // for(var i=0; i<results.items.length; i++){
        //   results.items[i].genre = $scope.genre;
        //   results.items[i]["platlistName"] = $scope.name;
        // }
        // $http({
        //     method: 'POST',
        //     url: "/save_playlist",
        //     data: angular.toJson(results),
        //     headers: {'Content-Type': 'application/json'}
        // })
        // .then(function(result) {
        //   $scope.result = result.data.result;
        // },
        // function(error) { // optional
        //   $log.log(error);
        //   $scope.result = "Couldn't make API call at this moment. See browser console for more information.";
        // });
      }
    }
]);