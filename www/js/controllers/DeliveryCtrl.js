
app.controller('DeliveryCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', '$ionicPopup', '$cordovaDatePicker', '$filter', '$ionicHistory', 'APIFactory',
	function($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout, $ionicPopup, $cordovaDatePicker, $filter, $ionicHistory, APIFactory) {
      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          if(!LSFactory.get('cart') || !LSFactory.get('checkout') || !LSFactory.get('shop')){
             
          }
  });

    $scope.paymentChoice = 'cod'; 
    $scope.location = LSFactory.get('location'); 
 
      var checkoutObj = LSFactory.get('checkout' ); 

      $scope.cartGrandTotal = checkoutObj.payment.grandTotal;
   $scope.preOrder = {preOrder:false, date: '', time: ''};
  $scope.setDate = function () {
  	 	 var options = {
    date: new Date(),
    mode: 'date', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };
  	    $cordovaDatePicker.show(options).then(function(date){
         var sDate = new Date(date);
  		 $scope.preOrder.date= $filter('date')(sDate, 'yyyy-MM-dd');
       
    });
 
  }  
  $scope.setTime = function () {
  	 	 var options = {
    date: new Date(),
    mode: 'time', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: false,
    allowFutureDates: true,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };
  	    $cordovaDatePicker.show(options).then(function(time){
         var sTime = new Date(time); 
  		 $scope.preOrder.time= $filter('date')(sTime, 'HH:mm:ss');
    
    });
 
  }
  $scope.saveUser = function (userInfo, preOrder) {
  	 	var tempUserObj = LSFactory.get('authUser') || {};
  	 	tempUserObj.name = userInfo.name;
  	 	tempUserObj.email = userInfo.email;
      tempUserObj.address = userInfo.address;
      tempUserObj.mobile = userInfo.mobile;
  	 	tempUserObj.location = LSFactory.get('location');

  	 	if(tempUserObj.id){
  	 	  	 	LSFactory.set('authUser', tempUserObj);
  	 	} else {
  	 	  	 	LSFactory.set('tempUserObj', tempUserObj);
  	 		
  	 	} 

       placeOrder();
  }

  function placeOrder () {
    Loader.show();
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
            APIFactory.placeOrder(finalOrder).then(function (response) {
              Loader.hide(); 
              if(response.data.hd_order_details){
                Loader.toast('Your order has been placed successfuly.');
                LSFactory.delete('cart');
                LSFactory.delete('shop');
                LSFactory.delete('checkout'); 
                $state.go('app.orders');
              }
            }, function (error) {
              Loader.hide();
                Loader.toast('Oops! something went wrong. Please try again');

            })
  }
}]);