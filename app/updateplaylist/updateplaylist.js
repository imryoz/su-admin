'use strict';

angular.module('myApp.updateplaylist', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/updateplaylist', {
    templateUrl: 'updateplaylist/updateplaylist.html',
    controller: 'UpdatePlaylist'
  });
}])

.controller('UpdatePlaylist', ['$window', '$rootScope', '$scope', '$log', '$http', '$timeout', '$sce', '$location', 'playlist',
    function($window, $rootScope, $scope, $log, $http, $timeout, $sce, $location, playlist) {
      $scope.playlist = playlist
      var data = {"playlistName":$window.localStorage.getItem('currentlyUpdating') }
      $log.log(data);  
      

      $http({
          method : "POST",
          url : "http://localhost:8090/fetch_playlist",
          data: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'}
      }).then(function mySuccess(response) {
          $scope.results = response.data;
          
          var results = $scope.results;
          
          $log.log(response);

          $scope.genre = results["genre"];
          $scope.language = results["language"];
          $scope.name = results["playlistName"];
          
          for(var i=0; i<results.items.length; i++){
            results.items[i].url = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+results.items[i].videoid+"?rel=0&amp;showinfo=0&start="+results.items[i].start+"&end="+results.items[i].end);
          }
      }, function myError(response) {
          $scope.error = response.statusText;
      });
      

      $scope.videoUrl = function(video) {
	    var videourl = "https://www.youtube.com/embed/"+video.videoid+"?rel=0&amp;showinfo=0&start="+video.start+"&end="+video.end;
	    var turl = $sce.trustAsResourceUrl(videourl);
	    video.url = turl;
	    $log.log($scope.results);
	  }
      $scope.updatePlaylist = function(item) {
        item["update"] = true;
        $log.log(item);
        $http({
            method: 'POST',
            url: "http://localhost:8090/save_playlist",
            data: angular.toJson(item),
            headers: {'Content-Type': 'application/json'}
        })
        .then(function(result) {
          $scope.result = result.data.result;
        },
        function(error) { // optional
          $log.log(error);
          $scope.result = "Couldn't make API call at this moment. See browser console for more information.";
        });
      }

      $scope.deleteVideo = function(item) {
        var data = {"title":item.title, "playlistName":item.playlistName}
        
        $http({
            method : "POST",
            url : "http://localhost:8090/delete_video",
            data: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).then(function mySuccess(response) {
            $log.log(response);
            $scope.playlist.currentlyUpdating = item.playlistName
            $window.location.reload()
            $log.log($scope.playlist.currentlyUpdating);
        }, function myError(response) {
            $scope.error = response.statusText;
        });
      }
    }
]);