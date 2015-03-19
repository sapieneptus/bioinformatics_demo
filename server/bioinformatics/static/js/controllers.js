var appControllers = angular.module('appControllers', []);
appControllers.controller('MainController', ['$scope', '$http',
  function ($scope, $http) {
  	alert("Hello");
    $http.get('./rows.json').success(function(data) {
      	$scope.rows = data;
    }).error(function(e){
    	console.log(e);
    });

}]);