
app.controller('OrdersCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'APIFactory', 'Loader', '$ionicHistory',
  function ($scope, $rootScope, $state, $stateParams, LSFactory, APIFactory, Loader, $ionicHistory) {
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $scope.getOrders();
    }); 
    $scope.getOrders = function () {
     
      if ($rootScope.isLoggedIn) {
         Loader.show(); 
        var user = LSFactory.get('authUser');
        APIFactory.orderHistory(user).then(function (response) {
          Loader.hide();
          $scope.orders = response.data.user_order_details;
          var axis = LSFactory.get('axis'); 
        }, function (error) {
          Loader.toast("Failed to fetch order(s)");
          Loader.hide();

        })
      }
    };
    $scope.loginFromOrder = function () {
      $rootScope.$broadcast('showLoginModal', $scope, function (argument) {
          Loader.toast("Login Failed"); 
      }, function (argument) {
        $scope.getOrders();
      });
    }
    $scope.getOrders();
    $scope.toggleItem = function (item) {
      if ($scope.isItemShown(item)) {
        $scope.shownItem = null;
      } else {
        $scope.shownItem = item;
      }
    };
    $scope.isItemShown = function (item) {
      return $scope.shownItem === item;
    };

  }]);
