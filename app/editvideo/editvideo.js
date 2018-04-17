'use strict';

angular.module('myApp.editvideo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editvideo', {
    templateUrl: 'editvideo/editvideo.html',
    controller: 'EditVideo'
  });
}])

.controller('EditVideo', ['$rootScope', '$scope', '$window', '$log', '$http', '$timeout', '$sce', 'video',
    function($rootScope, $scope, $window, $log, $http, $timeout, $sce, video) {
      $scope.video = video

      $http({
          method : "GET",
          url : "http://localhost:8090/get_videos"
      }).then(function mySuccess(response) {
          $log.log(response.data);
          $scope.videos = response.data;
      }, function myError(response) {
          $log.log(response);
          $scope.error = response.statusText;
      });

      $scope.updateVideo = function(item) {
        // $rootScope.plname = item.playlistName
        // $log.log($rootScope.plname);
        // $scope.video.currentlyUpdating = item.title
        $window.localStorage.setItem("currentlyUpdatingVideo",item.title)
        // localStorageService.set('currentlyUpdatingPlaylist', item.title)
        $window.location.href = "/#!/updatevideo"
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
            $scope.video.currentlyUpdating = item.title
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