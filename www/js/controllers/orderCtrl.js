
app.controller('OrdersCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'APIFactory', 'Loader',
function($scope, $rootScope, $state, $stateParams, LSFactory, APIFactory, Loader) {
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
});

  
 
  $scope.getOrders = function () {
    Loader.show();
     if(!$rootScope.isLoggedIn) {
           Loader.hide();
           $rootScope.$broadcast('showLoginModal', $scope, function (argument) {
              $state.go('app.home');
           }, function (argument) {
            $scope.getOrders();
           });
     } else {
      var user = LSFactory.get('authUser');  
       APIFactory.orderHistory(user).then(function (response) {
          $scope.orders = []
          $scope.tempOrder = response.data.hd_order_track_details;
          var axis = LSFactory.get('axis');
          $scope.tempOrder.forEach( function(element, index) {
            // statements
            APIFactory.getShopDetail(element.restaurant_id, axis).then(function (response) {
               element.shop_name = response.data.shop.name;
               element.shop_logo = response.data.shop.logo;
               $scope.orders.push(element);
            }, function (error) {
               /* body... */ 
               Loader.hide();
               console.error(error);
            })
          });
          Loader.hide();
       }, function (error) {
         Loader.toast("Failed to fetch order(s)");
         Loader.hide();

       })
     }
  };
  $scope.getOrders();
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
