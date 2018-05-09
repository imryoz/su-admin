'use strict';

angular.module('myApp.updatevideo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/updatevideo', {
    templateUrl: 'updatevideo/updatevideo.html',
    controller: 'UpdateVideo'
  });
}])

.controller('UpdateVideo', ['$window', '$rootScope', '$scope', '$log', '$http', '$timeout', '$sce', '$location', 'video',
    function($window, $rootScope, $scope, $log, $http, $timeout, $sce, $location, video) {
      $scope.video = video
      var data = {"title":$window.localStorage.getItem('currentlyUpdatingVideo') }
      $log.log(data);  
      
      $http({
          method : "POST",
          url : "http://localhost:8090/get_video_details",
          data: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'}
      }).then(function mySuccess(response) {
          var myEl = angular.element( document.querySelector( '#savebtn' ) );
          myEl.css("display", "initial");
          
          $scope.results = response.data;
          
          var results = $scope.results;
          
          $log.log(response);

          // $scope.genre = results["genre"];
          // $scope.name = results["playlistName"];
          results.url = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+results.videoid+"?rel=0&amp;showinfo=0&start="+results.start+"&end="+results.end);
          
      }, function myError(response) {
          $scope.error = response.statusText;
      });

      $scope.videoUrl = function(video) {
  	    var videourl = "https://www.youtube.com/embed/"+video.videoid+"?rel=0&amp;showinfo=0&start="+video.start+"&end="+video.end;
  	    var turl = $sce.trustAsResourceUrl(videourl);
        video.turl = turl;
  	    video.url = videourl;
  	    $log.log($scope.results);
  	  }

      $scope.saveVideo = function(item) {
        item["update"] = true;
        $http({
            method: 'POST',
            url: "http://localhost:8090/update_video_details",
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

    }
]);