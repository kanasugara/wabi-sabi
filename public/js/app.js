var myApp = angular.module('myApp', ['ngRoute']).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
		$routeProvider.when('/myprofile', {templateUrl: 'partials/myprofile.ejs', controller: 'profileController'});
		$routeProvider.when('/page2', {templateUrl: 'partials/page2.html'});
		$routeProvider.otherwise({redirectTo: '/home'});

		$locationProvider.html5Mode({enabled: true, requireBase: false});

	}]);