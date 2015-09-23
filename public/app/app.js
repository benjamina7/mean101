angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app')
	.config(function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});
		$routeProvider
			.when('/', { templateUrl: '/partials/main', controller: 'mainCtrl'})
			.when('/other', { templateUrl: '/partials/other', controller: 'otherCtrl'});
	});

angular.module('app')
	.controller('mainCtrl', function($scope) {
		$scope.myVar = "Totally Angular Dude!";
	});

angular.module('app')
	.controller('otherCtrl', function($scope) {
		$scope.myVar = "Totally Angular Dude!";
		$scope.myVar2 = "Rockin it";
	});
