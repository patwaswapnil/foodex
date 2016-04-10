
app.controller('PaymentCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', '$ionicHistory', 'APIFactory',
 function($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout, $ionicHistory, APIFactory) {
     $ionicHistory.nextViewOptions({
        disableBack: true
    });
  
      var checkoutObj = LSFactory.get('checkout' ); 

      $scope.cartGrandTotal = checkoutObj.payment.grandTotal;
      $scope.confirmOrder = function () {
           /* body... */  
           if(!LSFactory.get('orders')){ 
           LSFactory.setArray('orders', checkoutObj);

}
else{

            var cartObj = LSFactory.get('cart');
            var shopObj = LSFactory.get('shop');
            var checkOut = LSFactory.get('checkout');
            var paymentObj = checkOut.payment;
            var location = LSFactory.get('location');
            var userObj;
            if(LSFactory.get('authUser')){
                   userObj = LSFactory.get('authUser');
            } else {
                   userObj = LSFactory.get('tempUserObj');
            }
            var finalOrder = {data: { shop: shopObj, items: cartObj, payment:paymentObj, user:userObj}}; 
            console.log(finalOrder);
            APIFactory.placeOrder(finalOrder).then(function (data) {
               /* body... */ 
            }, function (error) {
               /* body... */ 
            })
}
            // LSFactory.delete('checkout');
            // LSFactory.delete('cart');
            // LSFactory.delete('address');
            // $rootScope.cartCount = 0;
            // $scope.$apply;
            // $state.go('app.order-confirmation');


      }
}]);
