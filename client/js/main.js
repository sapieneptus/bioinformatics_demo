(function(){
var App = angular.module('bioinformaticsDemo', 
	[
		'ngRoute'
	]);

App.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/categories', {
				templateUrl: './partials/categories.html',
				controller: 'MainController'
			}).
			when('/workflows', {
				templateUrl: './partials/workflows.html',
				controller: 'MainController'
			}).
			when('/edit/workflow/:workflow', {
				templateUrl: './partials/edit_workflow.html',
				controller: 'MainController'
			}).
			when('/edit/category/:category_id', {
				templateUrl: './partials/edit_category.html',
				controller: 'MainController'
			}).
			otherwise({
				redirectTo: '/categories'
			});
	}]);
	
	App.controller('MainController', ['$scope', function($scope) {
		this.datatype = "Categories";

		this.clickedNav = function(which){
			this.datatype = which;
		};

		this.navSelected = function(which) {
			return this.datatype === which;
		}

		var rows = [
			{
				"name" : "Category 1"
			},
			{
				"name" : "Category 2"
			},
			{
				"name" : "Category 3"
			}
		];
		this.rows=rows;

		$scope.todos = [
			{text:'learn angular', done:true},
			{text:'build an angular app', done:false}];
 
		$scope.addTodo = function() {
			$scope.todos.push({text:$scope.todoText, done:false});
			$scope.todoText = '';
		};
 
		$scope.remaining = function() {
			var count = 0;
			angular.forEach($scope.todos, function(todo) {
				count += todo.done ? 0 : 1;
			});
			return count;
		};
 
		$scope.archive = function() {
			var oldTodos = $scope.todos;
			$scope.todos = [];
			angular.forEach(oldTodos, function(todo) {
				if (!todo.done) $scope.todos.push(todo);
			});
		};

		// $scope.datatype = "DATAAA";
	}]);
})();