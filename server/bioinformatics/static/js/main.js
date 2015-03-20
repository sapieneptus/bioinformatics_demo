(function(){

	var app = angular.module('bioinformaticsDemo', 
		[
			'ngRoute',
			'ngAnimate',
			'internet'
		]);

	var db = { categories : {},
	workflows : {
		1 : {
			"id" : 1,
			"name" : "WF 1",
			"description" : "Workflow the first",
			"created_on" : Date.now(),
			"last_modified" : Date.now(),
			"categories" : {1:true},
			"num_steps" : 3
		},
		2 : {
			"id" : 2,
			"name" : "WF 2",
			"description" : "Workflow the second",
			"created_on" : Date.now(),
			"last_modified" : Date.now(),
			"categories" : {1:true, 3:true},
			"num_steps" : 4
		}
	}
};

/*
* 	Local functions for updating in-memory database
*/
function dbupsert(id, type, doc) { db[type][id] = doc; }
function dbdelete(id, type) 	{ delete db[type][id]; }
function dbget(id, type) 		{ return db[type][id]; }

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/categories', {
				templateUrl: '/static/partials/categories.html',
				controller: 'CategoryController',
				controllerAs: 'catCtrl'
			}).
			when('/workflows', {
				templateUrl: '/static/partials/workflows.html',
				controller: 'MainController'
			}).
			// when('/edit/workflow/:workflow', {
			// 	templateUrl: '/static/partials/edit-workflow.html',
			// 	controller: 'MainController'
			// }).
			// when('/edit/category/:category-id', {
			// 	templateUrl: '/static/partials/edit-category.html',
			// 	controller: 'MainController'
			// }).
			otherwise({
				redirectTo: '/categories'
			});
	}]);
	
	app.controller('MainController', function() {
		this.datatype = "Categories";

		this.clickedNav = function(which){
			this.datatype = which;
		};

		this.navSelected = function(which) {
			return this.datatype === which;
		}

	});

	app.controller('CategoryController', [ '$scope', '$rest', function($scope, $rest){
		var self 			= this;
		$rest.get({
			url: './category',
			success: function(cats) {
				_.each(cats, function(c){ dbupsert(c['id'], 'categories', c); });
			},
			error: console.log
		});
		
		$scope.categories 	= db['categories'];
		$scope.workflows 	= db['workflows'];
		self.editing 		= -1;
		self.new_cat 		= false;
		$scope.name 		= "";
		$scope.description 	= "";
		$scope.workflows 	= {};

		self.edit = function(cat_id) {
			self.editing  = cat_id;
			$('#collapse-' + cat_id ).collapse('show');
			$('#edit-cat-' + cat_id).hide();
		};

		/*
		*	I hate 'confirm()' as much as the next guy, 
		* 	but for rapid prototyping it does the job.
		*/
		self.delete = function(cat_id) {
			var name = db['categories'][cat_id].name;
			if (confirm("Are you sure you want to delete \"" + name + "\" ?")) {
				self.editing = -1;
				$rest.del({
					url: './category/' + cat_id,
					success: function(doc) {
						dbdelete(cat_id, 'categories');
					}, /* some animation would be nice */
					error: function(e) {
						alert("Unable to delete category. See logs");
						console.log(e);
					}
				});
			}
		};

		self.save = function(cat_id) {
			var new_data = {};
			new_data.name 			= $scope.name;
			new_data.description 	= $scope.description;
			new_data.created_on 	= Date.now();
			new_data.last_updated 	= Date.now();
			new_data.workflows 		= $scope.workflows;

			if (cat_id !== null) {  new_data.id = cat_id; } /* It's new */

			$rest.post({
				url :'./category', 
				data: new_data, 
				success: function(doc) { 
					self.editing = -1;
					self.showNewCat(false);
					$scope.newCatForm.$setPristine();
					db['categories'][doc.id] = doc;
				},
				error: function(e) {
					console.log(e);
					//There are a number of things that could go wrong
					//But the most common reason should be name collision
					alert("Unable to add category. Is the name unique?");
				}
			});
		};

		self.showNewCat = function(show) {
			self.new_cat = show;
		};

		self.isediting = function(cat_id) {
			return self.editing === cat_id;
		}
	}]);
})();