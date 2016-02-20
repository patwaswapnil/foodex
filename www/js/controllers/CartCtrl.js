app.controller('CartCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', function($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout) {
    $scope.navTitle = LSFactory.get('location');
    $scope.cartItems = LSFactory.get('cart');
    $scope.shopFrom = LSFactory.get('shop');
    $scope.discount;
    $scope.deliveryChar;
    $rootScope.grandTotal;
    $scope.removeFromCart = function(index) {
        $scope.cartItems.splice(index, 1);
        LSFactory.set('cart', $scope.cartItems);
        $scope.cartItems = LSFactory.get('cart');
        $rootScope.cartCount = $scope.cartItems.length;
        if ($rootScope.cartCount < 1) {
            LSFactory.delete('cart');
            LSFactory.delete('shop');
        }
        calculateTotal();
    }
    $scope.updateCart = function() {
        LSFactory.set('cart', $scope.cartItems);
        calculateTotal();
    }
    var calculateTotal = function() {
        Loader.showLoading();
        $timeout(function() {
            $scope.subTotal = 0;
            angular.forEach($scope.cartItems, function(val, index) {
                $scope.subTotal += (val.price * val.qty);
            });
            Loader.hideLoading()
        $scope.discount = 100;
        $scope.deliveryChar = $scope.shopFrom[0].minOrder > $scope.subTotal ? $scope.shopFrom[0].deliveryCharge : 0;
        $rootScope.grandTotal = ($scope.subTotal + $scope.deliveryChar) - $scope.discount; 
        $scope.availFreeDelivery = $scope.shopFrom[0].minOrder - $scope.subTotal ;
        }, 600)

    }
    if($scope.cartItems){
    calculateTotal();
    }
    $scope.cartCheckout = function(cartObj, shopObj, subTotal, deliveryChar, grandTotal) {
     var tempObj =  {"shop": shopObj, "payment":{"subtotal":subTotal, "deliveryCharge":deliveryChar, "grandTotal":grandTotal}, "items":cartObj, "address":""};
      LSFactory.set('checkout',  tempObj ); 
    $state.go('app.delivery');
    }

}]);