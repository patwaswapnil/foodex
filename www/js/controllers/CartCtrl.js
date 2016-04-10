app.controller('CartCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', function($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout) {
    $scope.navTitle = LSFactory.get('location');
    $scope.cartItems = LSFactory.get('cart');
    $scope.shopFrom = LSFactory.get('shop'); 
    $scope.deliveryChar = $scope.shopFrom.hd_delivery_charge;
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
    $scope.updateCart = function(cartItem) {
        $scope.getTotalQty(cartItem); 
        LSFactory.set('cart', $scope.cartItems);
        calculateTotal();
    }
    var calculateTotal = function() {
        Loader.show();
        $timeout(function() {
            $scope.subTotal = 0;
            angular.forEach($scope.cartItems, function(val, index) {
                $scope.subTotal += (val.cost * val.status);
            });
            Loader.hide()
        // $scope.discount = (10/100) * $scope.subTotal;
        // $scope.deliveryChar = delivery_charge $scope.shopFrom[0].minOrder > $scope.subTotal ? $scope.shopFrom[0].deliveryCharge : 0;
         
        $rootScope.grandTotal = ($scope.subTotal + $scope.deliveryChar); 
        $scope.availFreeDelivery = $scope.shopFrom.hd_min_val - $scope.subTotal ;
        }, 200)

    }
    if($scope.cartItems){
    calculateTotal();
    }
    $scope.cartCheckout = function(cartObj, shopObj, subTotal, deliveryChar, grandTotal) {
     var tempObj =  {"payment":{"subtotal":subTotal, "deliveryCharge":deliveryChar, "grandTotal":grandTotal, "delivery_date":"", "delivery_time":""}};
    LSFactory.set('checkout',  tempObj ); 
    $state.go('app.delivery');
    }

}]);