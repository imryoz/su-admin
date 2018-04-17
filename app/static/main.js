(function () {
  'use strict';

  var app = angular.module('ShortUploads', ['ngRoute'])

  // app.config(function(socialProvider){
  //   // socialProvider.setGoogleKey("YOUR GOOGLE CLIENT ID");
  //   socialProvider.setFbKey({appId: "303940316802927", apiVersion: "v2.12"});
  // });

  app.config(function($routeProvider) {
      $routeProvider
      .when("/", {
          templateUrl : "main.htm"
      })
      .when("/gallery", {
          templateUrl : "red.htm"
      })
      .when("/watch", {
          templateUrl : "green.htm"
      })
      .when("/adminpage", {
          templateUrl : "blue.htm"
      });
      .when("/editplaylist", {
          templateUrl : "main.htm"
      })
      .when("/updateplaylist", {
          templateUrl : "red.htm"
      })
      .when("/creatplaylist", {
          templateUrl : "green.htm"
      })
      .when("/addvideo", {
          templateUrl : "blue.htm"
      });
  });
  
  app.controller('AuthController', ['$scope', '$window', '$rootScope', '$log', '$http', '$timeout',
    function($scope, $window, $rootScope, $log, $http, $timeout) {
      
      $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
        $scope.userDetails = userDetails;
        $log.log(userDetails);
        // $window.location.href = '/gallery';
      });
      
      $scope.getResults = function() {
        $log.log("test");

        var name = $scope.name;
        var email = $scope.email;
        var password = $scope.password;

	    $http.post('/signup', {"name": name,"email": email,"password": password}).
	      success(function(results) {
	        $log.log(results);
          $scope.result = results;
	      }).
	      error(function(error) {
	        $log.log(error);
          $scope.result = error;
	      });
      };
    }
  ]);

  app.controller('galleryController', ['$scope', '$window', '$rootScope', '$log', '$http', '$timeout',
    function($scope, $window, $rootScope, $log, $http, $timeout) {
      $log.log($scope.userDetails);
    }
  ]);

  app.controller('CreatePlaylist', ['$scope', '$log', '$http', '$timeout', '$sce',
    function($scope, $log, $http, $timeout, $sce) {
      $scope.responseById = function() {
        $scope.result = "Fetching ID";
        
        var link = $scope.link
        $scope.result = "Making API Call...";

        var data = {"link":link}


        $http({
          method: 'POST',
          url: "/fetch_playlist",
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
            results.items[i]["start"] = video.start || "";
            results.items[i]["end"] = video.end || "";
            results.items[i]["genre"] = video.genre || "";
            
            var videourl = "https://www.youtube.com/embed/"+video.id+"?rel=0&amp;showinfo=0&start="+video.start+"&end="+video.end
            var turl = $sce.trustAsResourceUrl(videourl)
            results.items[i].url = turl

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
        video.url = turl;
        $log.log($scope.results);
      }
      $scope.savePlaylist = function(results) {
        $log.log(results);
        results["genre"] = $scope.genre;
        results["playlistName"] = $scope.name;
        results["update"] = false;
        for(var i=0; i<results.items.length; i++){
          results.items[i].genre = $scope.genre;
          results.items[i]["platlistName"] = $scope.name;
        }
        $http({
            method: 'POST',
            url: "/save_playlist",
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

  app.controller('EditPlaylist', ['$rootScope', '$scope', '$window', '$log', '$http', '$timeout', '$sce',
    function($rootScope, $scope, $window, $log, $http, $timeout, $sce) {
      $http({
          method : "GET",
          url : "/getplaylistname"
      }).then(function mySuccess(response) {
          $scope.playlists = response.data.playlist;
      }, function myError(response) {
          $scope.error = response.statusText;
      });

      $scope.updatePlaylist = function(item) {
        // $rootScope.plname = item.playlistName
        // $log.log($rootScope.plname);
        $window.location.href = "/updateplaylist#/?playlistName="+item.playlistName
      }
      $scope.deletePlaylist = function(item) {
        var data = {"playlistName":item.playlistName}
        $http({
            method : "POST",
            url : "/delete_playlist",
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

  app.controller('UpdatePlaylist', ['$rootScope', '$scope', '$log', '$http', '$timeout', '$sce', '$location',
    function($rootScope, $scope, $log, $http, $timeout, $sce, $location) {
      var data = {"playlistName":$location.search().playlistName }
      $log.log(data);  
      
      $http({
          method : "POST",
          url : "/fetch_playlist",
          data: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'}
      }).then(function mySuccess(response) {
          $scope.results = response.data;
          
          var results = $scope.results;
          
          $log.log(response);

          $scope.genre = results["genre"];
          $scope.name = results["playlistName"];
          
          for(var i=0; i<results.items.length; i++){
            results.items[i].url = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+results.items[i].videoid+"?rel=0&amp;showinfo=0&start="+results.items[i].start+"&end="+results.items[i].end);
          }
      }, function myError(response) {
          $scope.error = response.statusText;
      });

      $scope.updatePlaylist = function(item) {
        item["update"] = true;
        $http({
            method: 'POST',
            url: "/save_playlist",
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

  app.controller('addVideo', ['$scope', '$log', '$http', '$timeout', '$sce',
    function($scope, $log, $http, $timeout, $sce) {
      $scope.responseById = function() {
        $scope.result = "Getting video using the link...";
        var link = $scope.link;

        $scope.result = "Making API Call...";
        // $http.defaults.headers.post["Content-Type"] = "application/json";
        var data = {link: link};
        $http({
            method: 'POST',
            url: "/video",
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
      };
      
      // $scope.videoUrl = function(video) {
      //   var videourl = "https://www.youtube.com/embed/"+video.id+"?rel=0&amp;showinfo=0&start="+video.start+"&end="+video.end;
      //   var turl = $sce.trustAsResourceUrl(videourl);
      //   video.url = turl;
      //   $log.log($scope.results);
      // }

      $scope.saveVideo = function(results) {
        $log.log(results);
        $http({
            method: 'POST',
            url: "/createvideo",
            data: JSON.stringify(results),
            headers: {'Content-Type': 'application/json'}
        })
        .then(function(result) {
          $scope.result = "Succesfully Saved";
        },
        function(error) { // optional
          $log.log(error);
          $scope.result = "Couldn't make API call at this moment. See browser console for more information.";
        });
      }
    }
  ]);
}());