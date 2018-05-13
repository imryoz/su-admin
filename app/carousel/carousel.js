'use strict';

angular.module('myApp.carousel', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/carousel', {
    templateUrl: 'carousel/carousel.html',
    controller: 'carousel'
  });
}])

.controller('carousel', ['$window', '$scope', '$log', '$http', '$timeout', '$sce',
function($window, $scope, $log, $http, $timeout, $sce) {

    $scope.allImages = [];

    $http({
        method : "GET",
        url : "http://localhost:8090/get_advert"
    }).then(function mySuccess(response) {
        $log.log(response.data.result);
        $scope.allImages = response.data.advert;
    }, function myError(response) {
        $scope.error = response.statusText;
    });

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

    $scope.saveImage = function() {
      // $scope.allImages.push(item);
      let item = {}
      item["image"] = $scope.image_source;
      item["title"] = "Carousel Item "+($scope.allImages.length+1);
      $http({
          method : "POST",
          url : "http://localhost:8090/addadvert",
          data: JSON.stringify(item),
          headers: {'Content-Type': 'application/json'}
      }).then(function mySuccess(response) {
          $log.log(response);
          $scope.image_source = "";
          $window.location.reload();
      }, function myError(response) {
          $scope.error = response.statusText;
      });
      // $log.log($scope.allImages);
      // $scope.image_source = "";
      // $window.location.reload();
    }

    $scope.deleteImage = function(item) {
      $http({
          method : "POST",
          url : "http://localhost:8090/deleteadvert",
          data: JSON.stringify({"title":item.title}),
          headers: {'Content-Type': 'application/json'}
      }).then(function mySuccess(response) {
          $log.log(response);
          $window.location.reload();
      }, function myError(response) {
          $scope.error = response.statusText;
      });
      // $window.location.reload();  
    }

}]);