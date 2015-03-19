(function(){

var csrftoken = $.cookie('csrftoken');
function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var app = angular.module('bioinformaticsDemo', 
	[
		'ngRoute'
	]);

var db = {
	categories : {
			1 : {
				"id" : 1,
				"name" : "Category 1",
				"description" : "The First Category",
				"created_on" : Date.now(),
				"last_modified" : Date.now(),
				"workflows" : []
			},
			2 : {
				"id" : 2,
				"name" : "Category 2",
				"description" : "The Second Category",
				"created_on" : Date.now(),
				"last_modified" : Date.now(),
				"workflows" : []
			},
			3 : {
				"id" : 3,
				"name" : "Category 3",
				"description" : "The Third Category",
				"created_on" : Date.now(),
				"last_modified" : Date.now(),
				"workflows" : []
			}
	},
	workflows : {
		1 : {
			"id" : 1,
			"name" : "WF 1",
			"description" : "Workflow the first",
			"created_on" : Date.now(),
			"last_modified" : Date.now(),
			"categories" : [1],
			"num_steps" : 3
		},
		2 : {
			"id" : 2,
			"name" : "WF 2",
			"description" : "Workflow the second",
			"created_on" : Date.now(),
			"last_modified" : Date.now(),
			"categories" : [3],
			"num_steps" : 4
		}
	}
}

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
			when('/edit/workflow/:workflow', {
				templateUrl: '/static/partials/edit-workflow.html',
				controller: 'MainController'
			}).
			when('/edit/category/:category-id', {
				templateUrl: '/static/partials/edit-category.html',
				controller: 'MainController'
			}).
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

	app.controller('CategoryController', function(){
		var self = this;
		self.editing = -1;
		self.new_cat = false;

		self.edit = function(cat_id) {
			self.editing  = cat_id;
			$('#collapse-' + cat_id ).collapse('show');
			$('#edit-cat-' + cat_id).hide();
		};

		self.delete = function(cat_id) {
			self.editing = -1;
			console.log("Delete", cat_id);
			dbdelete(cat_id, 'categories');
		};

		self.save = function(cat_id) {
			console.log("Save", cat_id);
			self.editing = -1;
		};

		self.new_cat = function() {
			console.log("New cat");
		}

		self.categories = db['categories'];
		self.workflows = db['workflows'];
	});
})();