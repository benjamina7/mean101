angular.module('app')
	.controller('mvMainCtrl', function($scope) {
		$scope.myVar = "Totally Angular Dude!";
		$scope.courses = [
			{name: 'Course A', featured: true, published: new Date('2015-09-01')},
			{name: 'Course B', featured: false, published: new Date('2015-08-01')},
			{name: 'Course C', featured: false, published: new Date('2015-10-01')},
			{name: 'Course I', featured: true, published: new Date('2014-09-01')},
			{name: 'Course H', featured: false, published: new Date('2015-09-01')},
			{name: 'Course G', featured: true, published: new Date('2015-09-01')},
			{name: 'Course F', featured: false, published: new Date('2014-09-15')},
			{name: 'Course E', featured: false, published: new Date('2015-09-18')},
			{name: 'Course D', featured: true, published: new Date('2015-09-01')}
		]
	});