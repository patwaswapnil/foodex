
app.controller('PaymentCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', '$ionicHistory', function($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout, $ionicHistory) {
     $ionicHistory.nextViewOptions({
        disableBack: true
    });
      var checkoutObj = LSFactory.get('checkout' ); 
      var date = new Date("October 13, 2014 11:13:00");
      console.log(date);
      var orderDetail = {"OrderId": Math.floor((Math.random() * 1000000) + 1), "orderDate": date, "Address":LSFactory.get('address')};
      if(checkoutObj){
      angular.extend(checkoutObj, orderDetail);
  }else {
      return false;
  }
      LSFactory.set('checkout',checkoutObj)
      var checkoutObj = LSFactory.get('checkout' ); 

      $scope.cartGrandTotal = checkoutObj.payment.grandTotal;
      $scope.confirmOrder = function () {
           /* body... */ 
           var checkoutObj = LSFactory.get('checkout');
           if(!LSFactory.get('orders')){ 
           LSFactory.setArray('orders', checkoutObj);

}
else{

            var tempOrderObj = LSFactory.get('orders');
            console.log(checkoutObj);
            console.log(tempOrderObj);
            tempOrderObj.push(checkoutObj);
            angular.extend(tempOrderObj, checkoutObj );
            LSFactory.set('orders', tempOrderObj);
            console.log(LSFactory.get('orders'));
}
            LSFactory.delete('checkout');
            LSFactory.delete('cart');
            LSFactory.delete('address');
            $rootScope.cartCount = 0;
            $scope.$apply;
            $state.go('app.order-confirmation');


      }
}]);
