'use strict';

(function(){
	var app = angular.module('bioinformaticsDemo', 
		[
			'ngRoute',
			'ngAnimate',
			'internet'
		]);


	app.factory('$db', ['$http', function($http){
		var db = {
			categories 	: {},
			workflows 	: {},
			/*
			* 	Convenience functions for updating in-memory database
			*/
			dbupsert: 	function(id, type, doc) { db[type][id] = doc; 	},
			dbdelete: 	function(id, type) 		{ delete db[type][id]; 	},
			dbget: 	function(id, type) 		{ return db[type][id];	 }
		};
		$http.get('/static/workflows.json').success(function(wf){
			_.extend(db.workflows, wf);
		}).error(function(data, status, headers, config){
			console.log(data);
		});
		return db;
	}]);

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
				otherwise({
					redirectTo: '/categories'
				});
		}
	]);
		
	app.controller('MainController', function() {
		this.datatype = "Categories";

		this.clickedNav = function(which){
			this.datatype = which;
		};

		this.navSelected = function(which) {
			return this.datatype === which;
		}

	});

	app.controller('CategoryController', [ '$scope', '$rest', '$db', function($scope, $rest, $db){
		var self 			= this;
		$rest.get({
			url: './category',
			success: function(cats) {
				_.each(cats, function(c){ $db.dbupsert(c['id'], 'categories', c); });
				self.updateCategories();
			},
			error: console.log
		});
		
		self.categories 		= [];
		
		$scope.name 			= "";
		$scope.description 		= "";
		$scope.cat_workflows 	= {};

		self.editing 			= -1;    	/* sentinal val */
		self.new_cat 			= false;	/* sentinal val */
		self.edit_buf 			= null;		/* sentinal val */
		self.workflows 			= $db.workflows;

		self.edit = function(cat_id) {
			self.editing  = cat_id;
			self.edit_buf = JSON.parse(JSON.stringify($db.dbget(cat_id, 'categories'))); /* sloppy deep copy */
			$('#collapse-' + cat_id ).collapse('show');
			$('#edit-cat-' + cat_id).hide();
		};

		/*
		*	I hate 'confirm()' as much as the next guy, 
		* 	but for rapid prototyping it does the job.
		*/
		self.delete = function(cat_id) {
			var name = $db.categories[cat_id].name;
			if (confirm("Are you sure you want to delete \"" + name + "\" ?")) {
				self.editing = -1;
				$rest.del({
					url: './category/' + cat_id,
					success: function(doc) {
						$db.dbdelete(cat_id, 'categories');
						self.updateCategories();
					}, /* some animation would be nice */
					error: function(e) {
						alert("Unable to delete category. See logs");
						console.log(e);
					}
				});
			}
		};

		self.upsert = function(new_data) {
			$rest.post({
				url :'./category', 
				data: new_data, 
				success: function(doc) { 
					self.editing = -1;
					self.showNewCat(false);
					$scope.newCatForm.$setPristine();
					$db.categories[doc.id] = doc;
					self.updateCategories();
				},
				error: function(e) {
					console.log(e);
					//There are a number of things that could go wrong
					//But the most common reason should be name collision
					alert("Unable to update category. Is the name unique?");
				}
			});
		};

		self.save_edits = function(cat) {
			if (cat.name.length == 0) {
				alert("Must specify a name for the category.");
			} else {
				self.upsert(cat);
			}
		};

		self.save_new = function(cat_id) {
			var new_data = {};
			new_data.name 			= $scope.name;
			new_data.description 	= $scope.description;
			new_data.created_on 	= Date.now();
			new_data.last_updated 	= Date.now();
			new_data.workflows 		= $scope.cat_workflows;
			console.log(new_data.workflows);
			self.upsert(new_data);
			$scope.cat_workflows 	= {};
		};
		/* handler for checking a checkbox in the new category dialog */
		self.checked_workflow = function(wf_id) {
			var val = !!!($scope.cat_workflows[wf_id]);
			if (val === false) delete $scope.cat_workflows[wf_id];
			else { $scope.cat_workflows[wf_id] = true; }
			console.log($scope.cat_workflows);
		};
		/* new category dialogue */
		self.showNewCat = function(show) { self.new_cat = show; };
		/* check if editing mode active */
		self.isediting 	= function(cat_id) { return self.editing === cat_id; };
		/* cancel edit mode */
		self.canceledit = function(cat_id) { 
			self.editing = -1; 
			$db.dbupsert(cat_id, 'categories', self.edit_buf); 
		};
		/* convenience method for getting workflows */
		self.getWorkflow = function(wf_id) { return $db.dbget(wf_id, 'workflows'); }
		/* method to get categories in sorted order by date of creation */
		self.updateCategories = function() {
			var cats = _.map($db.categories, function(cat) { return cat; });
			self.categories = _.sortBy(cats, function(c) { return - (c.created_on) });
		};
		self.removeWorkflow = function(wf_id, cat) {
			var index = cat.workflows.indexOf(wf_id);
			cat.workflows.splice(index, 1);
		};
	}]);
})();