
app.controller('OrdersCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 
function($scope, $rootScope, $state, $stateParams, LSFactory) {
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
});

  if (!$rootScope.isLoggedIn) {
     $rootScope.$broadcast('showLoginModal', $scope, function (argument) {
        $state.go('app.home');
     }, null);
  }
  $scope.toggleItem= function(item) {
    if ($scope.isItemShown(item)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = item;
    }
  };
  $scope.isItemShown = function(item) {
    return $scope.shownItem === item;
  };
 
}]);
