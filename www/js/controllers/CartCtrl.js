app.controller('CartCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', function ($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout) {
    $scope.navTitle = LSFactory.get('location');
    $scope.cartItems = LSFactory.get('cart');
    $scope.shopFrom = LSFactory.get('shop');
    $scope.deliveryChargeCopy = angular.copy($scope.shopFrom.hd_delivery_charge);
    $scope.deliveryChar = $scope.shopFrom.hd_delivery_charge;
    $rootScope.grandTotal;
    $scope.removeFromCart = function (index) {
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
    $scope.updateCart = function (cartItem) {
        $scope.getTotalQty(cartItem);
        LSFactory.set('cart', $scope.cartItems);
        calculateTotal();
    }
    var calculateTotal = function () {
        Loader.show();
        $scope.deliveryChargeCopy = $scope.shopFrom.hd_delivery_charge;
        $timeout(function () {
            $scope.subTotal = 0;
            angular.forEach($scope.cartItems, function (val, index) {
                $scope.subTotal += (val.cost * val.status);
            });
            Loader.hide()
            // $scope.discount = (10/100) * $scope.subTotal; 
            $scope.deliveryChar = $scope.subTotal >= $scope.shopFrom.freeDeliveryAbove ? 0 : $scope.deliveryChargeCopy;

            $scope.availFreeDelivery = $scope.shopFrom.hd_min_val - $scope.subTotal;
             var serviceCharge = ($scope.subTotal * $scope.shopFrom.service_charges)/100;
             $scope.taxes = Math.round((((serviceCharge + $scope.deliveryChargeCopy) * $scope.shopFrom.service_tax)/100)); 
            $rootScope.grandTotal = ($scope.subTotal + $scope.deliveryChar + $scope.taxes);
            console.log($scope.deliveryChargeCopy)
        }, 200)

    }
    if ($scope.cartItems) {
        calculateTotal();
    }
    $scope.cartCheckout = function (cartObj, shopObj, subTotal, deliveryChar, grandTotal, taxes) {
        var tempObj = { "payment": { "subtotal": subTotal, "deliveryCharge": deliveryChar, "grandTotal": grandTotal, "taxes": taxes, "delivery_date": "", "delivery_time": "", "specialComments": "" } };
        LSFactory.set('checkout', tempObj);
        $state.go('app.delivery');
    }

}]);