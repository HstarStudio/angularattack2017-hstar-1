angular.module('app', [])
  .controller('DefaultController', ['$scope', function ($scope) {
    $scope.message = 'Hello Angular!';
  }]);

angular.bootstrap(document, ['app']);
