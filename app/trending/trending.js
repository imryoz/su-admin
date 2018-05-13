'use strict';

angular.module('myApp.trending', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trending', {
    templateUrl: 'trending/trending.html',
    controller: 'Trending'
  });
}])

.controller('Trending', ['$rootScope', '$scope', '$window', '$log', '$http', '$timeout', '$sce', 'video',
    function($rootScope, $scope, $window, $log, $http, $timeout, $sce, video) {
      $scope.video = video
      $scope.trending = {}
      $scope.language = "Telugu";

      $scope.getVideosAgain = function(){
        $scope.videos = [];
        $http({
            method : "POST",
            url : "http://localhost:8090/get_videos",
            data: JSON.stringify({"language":$scope.language})
        }).then(function mySuccess(response) {
            $log.log(response.data);
            $scope.videos = response.data;
            $http({
                method : "GET",
                url : "http://localhost:8090/gettrending"
            }).then(function mySuccess(response) {
                $log.log(response.data);
                for(var i=0; i<$scope.videos.length; i++){
                  if(response.data[$scope.videos[i]["title"]]){
                    $scope.videos[i]["checked"] = true;
                    console.log($scope.videos);
                  }
                }
            }, function myError(response) {
                $log.log(response);
                $scope.error = response.statusText;
            });
        }, function myError(response) {
            $log.log(response);
            $scope.error = response.statusText;
        });
      }

      $http({
          method : "POST",
          url : "http://localhost:8090/get_videos",
          data: JSON.stringify({"language":$scope.language})
      }).then(function mySuccess(response) {
          $log.log(response.data);
          $scope.videos = response.data;
          $http({
              method : "GET",
              url : "http://localhost:8090/gettrending"
          }).then(function mySuccess(response) {
              $log.log(response.data);
              for(var i=0; i<$scope.videos.length; i++){
                if(response.data[$scope.videos[i]["title"]]){
                  $scope.videos[i]["checked"] = true;
                  console.log($scope.videos);
                }
              }
          }, function myError(response) {
              $log.log(response);
              $scope.error = response.statusText;
          });
      }, function myError(response) {
          $log.log(response);
          $scope.error = response.statusText;
      });

      $scope.changeValue = function(item) {
        var trending = {};
        trending[item.title] = item;
        console.log(trending)
        if(item.checked){
          angular.copy(trending);
          $http({
              method : "POST",
              url : "http://localhost:8090/trending",
              data: JSON.stringify(item),
              headers: {'Content-Type': 'application/json'}
          }).then(function mySuccess(response) {
              $log.log(response);
          }, function myError(response) {
              $scope.error = response.statusText;
          });
        }else{
          angular.copy(trending);
          $http({
              method : "POST",
              url : "http://localhost:8090/removetrending",
              data: JSON.stringify(item),
              headers: {'Content-Type': 'application/json'}
          }).then(function mySuccess(response) {
              $log.log(response);
          }, function myError(response) {
              $scope.error = response.statusText;
          });
          delete trending[item.title];
        }
        $log.log(trending);
        $window.localStorage.setItem("TRENDING",trending)
        // localStorageService.set('currentlyUpdatingPlaylist', item.title)
        // $window.location.href = "/#!/updatevideo"
      }

      $scope.search = function(item) {
        var input, filter, table, tr, td, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("example-checkbox");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        console.log(tr);
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[1];
          if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          } 
        }
      }
    }
]);