'use strict';

angular.module('myApp.createplaylist', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createplaylist', {
    templateUrl: 'createplaylist/createplaylist.html',
    controller: 'CreatePlaylist'
  });
}])

.controller('CreatePlaylist', ['$scope', '$log', '$http', '$timeout', '$sce',
	function($scope, $log, $http, $timeout, $sce) {
	  $scope.responseById = function() {
	    $scope.result = "Fetching ID";
	    
	    var link = $scope.link
	    $scope.result = "Making API Call...";

	    var data = {"link":link}


	    $http({
	      method: 'POST',
	      url: "http://localhost:8090/fetch_playlist",
	      data: JSON.stringify(data),
	      headers: {'Content-Type': 'application/json'}
	    })
	    .then(function(results) {
	      var results = results.data;
	      $log.log(results);

	      var afterget = angular.element( document.querySelectorAll( '.after-get' ) );
	      afterget.css("display", "initial");

	      $scope.result = "Fetching Results..";
	      var videos = []
	      for(var i=0; i<results.items.length; i++){
	        var video = {}
	        video.id = results.items[i].videoid;
	        video.title = results.items[i].title;
	        video.start = undefined;
	        video.end = undefined;
	        video.genre = undefined;
	        video.language = undefined;
	        results.items[i]["start"] = video.start || "";
	        results.items[i]["end"] = video.end || "";
	        results.items[i]["genre"] = video.genre || "";
	        results.items[i]["language"] = video.language || "";
	        
	        var videourl = "https://www.youtube.com/embed/"+video.id+"?rel=0&amp;showinfo=0&start="+video.start+"&end="+video.end
	        var turl = $sce.trustAsResourceUrl(videourl)
	        results.items[i].turl = turl
	        results.items[i].url = videourl

	        videos.push(video)
	      }
	      $scope.results = results;
	      $scope.videos = videos;
	      $scope.result = "";
	    },
	    function(error) {
	      $log.log(error);
	      $scope.result = "Couldn't make API call at this moment. See browser console for more information.";
	    });
	  };
	  $scope.videoUrl = function(video) {
	    var videourl = "https://www.youtube.com/embed/"+video.videoid+"?rel=0&amp;showinfo=0&start="+video.start+"&end="+video.end;
	    var turl = $sce.trustAsResourceUrl(videourl);
	    video.url = videourl;
	    video.turl = turl;
	    $log.log($scope.results);
	  }
	  $scope.savePlaylist = function(results) {
	    results["genre"] = $scope.genre;
	    results["language"] = $scope.language;
	    results["playlistName"] = $scope.name;
	    results["update"] = false;
	    for(var i=0; i<results.items.length; i++){
	      results.items[i].genre = $scope.genre;
	      results.items[i].language = $scope.language;
	      results.items[i]["platlistName"] = $scope.name;
	    }
	    $log.log(results);
	    $http({
	        method: 'POST',
	        url: "http://localhost:8090/save_playlist",
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
	}
]);