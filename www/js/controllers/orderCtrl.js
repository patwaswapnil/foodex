
app.controller('OrdersCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', function($scope, $rootScope, $state, $stateParams, LSFactory) {
    $scope.orders =  LSFactory.get('orders');
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
 $scope.orders =  LSFactory.get('orders');
})

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
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
