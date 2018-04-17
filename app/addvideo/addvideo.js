'use strict';

angular.module('myApp.addvideo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addvideo', {
    templateUrl: 'addvideo/addvideo.html',
    controller: 'addVideo'
  });
}])

.controller('addVideo', ['$scope', '$log', '$http', '$timeout', '$sce',
function($scope, $log, $http, $timeout, $sce) {
  
  $http({
      method : "GET",
      url : "http://localhost:8090/getplaylistname"
  }).then(function mySuccess(response) {
      $scope.playlists = response.data.playlist;
  }, function myError(response) {
      $scope.error = response.statusText;
  });

  $scope.responseById = function() {
    $scope.result = "Getting video using the link...";
    var link = $scope.link;

    $scope.result = "Making API Call...";
    // $http.defaults.headers.post["Content-Type"] = "application/json";
    var data = {link: link};

    $http({
        method: 'POST',
        url: "http://localhost:8090/video",
        data: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
    .then(function(results) {
      var myEl = angular.element( document.querySelector( '#savebtn' ) );
      myEl.css("display", "initial");

      $log.log(results.data);

      $scope.result = "Fetching Result..";
      var videos = []
      results = results.data;
      
      var video = {}
      video.id = results.videoid;
      video.title = results.title;
      results["start"] = $scope.start || "";
      results["end"] = $scope.end || "";
      results["genre"] = $scope.genre || "";
      results["language"] = $scope.language || "";
      results["playlistName"] = $scope.playlistName || "";
      
      var videourl = "https://www.youtube.com/embed/"+video.id+"?rel=0&amp;showinfo=0&start="+results.start+"&end="+results.end
      var turl = $sce.trustAsResourceUrl(videourl)
      results.url = turl
      videos.push(video)

      $scope.results = results;
      // $log.log(results.data.items[i].id);
      $scope.video = video;
      $scope.result = "";
    }, 
    function(error) { // optional
      $log.log(error);
      $scope.result = "Couldn't make API call at this moment. See browser console for more information.";
    });
  }
  $scope.saveVideo = function(results) {
	    $log.log(results);
      
	    $http({
	        method: 'POST',
	        url: "http://localhost:8090/save_video",
	        data: angular.toJson(results),
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
}]);