(function(){ 
	var app 		= angular.module('internet', []);

	/*
	* 	REST interface service
	*/

	app.factory('$rest',['$http',function($http){
		var self 		= this;
		var csrftoken 	= $.cookie('csrftoken');


		var req = function(method, options) {
			var req = {
					method: 		method,
					url: 			options.url,
					data: 			options.data,
					contentType: 	'application/json',
					headers: 		{ "X-CSRFToken" : csrftoken }
			};
			$http(req).success(options.success).error(options.error);
		};
		return {
			put 	: function(options) { req('PUT', 	options); },
			post 	: function(options) { req('POST', 	options); },
			get 	: function(options) { req('GET', 	options); },
			del 	: function(options) { req('DELETE', options); }
		};
	}]);
})();
