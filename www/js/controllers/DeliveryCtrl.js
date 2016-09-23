
app.controller('DeliveryCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', '$ionicPopup', '$cordovaDatePicker', '$filter', '$ionicHistory', 'APIFactory',
  function ($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout, $ionicPopup, $cordovaDatePicker, $filter, $ionicHistory, APIFactory) {
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      if (!LSFactory.get('cart') || !LSFactory.get('checkout') || !LSFactory.get('shop')) {
      }
    });
    $scope.comment = '';
     var paymentTempObj = (LSFactory.get('checkout')).payment; 
     var shopFrom =  LSFactory.get('shop')
    $scope.getShopLocationById = function (shopId) {
      Loader.show(); 
      console.log(shopId)
      APIFactory.getShopLocationById(shopId).then(function (response) {
        Loader.hide();
        $scope.shopDelLocation = response.data;
      }, function (error) {
        Loader.hide();
        console.error(error);
      })
    }
    $scope.getShopLocationById((LSFactory.get('shop')).id);
       var calculateTotal = function (deliveryChar) {
      var tempCheck = LSFactory.get('checkout');
        Loader.show();
         if (tempCheck.payment.deliveryCharge > 0) {
              tempCheck.payment.deliveryCharge = deliveryChar;
          } else {
              tempCheck.payment.deliveryCharge = 0; 
          }
        $timeout(function () {   
             var serviceCharge = (paymentTempObj.subtotal * shopFrom.service_charges)/100;
             $scope.taxes = Math.round((((serviceCharge + deliveryChar) * shopFrom.service_tax)/100)); 
            $scope.cartGrandTotal = (paymentTempObj.subtotal + tempCheck.payment.deliveryCharge + $scope.taxes); 
            shopFrom.hd_delivery_charge = deliveryChar;
            LSFactory.set('shop', shopFrom); 
            tempCheck.payment.grandTotal = $scope.cartGrandTotal;
            LSFactory.set('checkout', tempCheck);
            Loader.hide();
            Loader.toast('Total price has been updated');
        }, 200)

    }
    $scope.updateCartTotal = function () { 
      Loader.show(); 
      LSFactory.set('location', $scope.location);
    var axis = {lat:jQuery('#location option:selected').attr('data-lat'), long:jQuery('#location option:selected').attr('data-long')};
    APIFactory.getShopDetail((LSFactory.get('shop')).id, axis).then(function (response){
      Loader.hide();
      var oldDelCharge = (LSFactory.get('shop')).hd_delivery_charge;
      if(response.data.delCharge != oldDelCharge) {
        calculateTotal(response.data.delCharge);
      } 
      LSFactory.set('location', jQuery('#location option:selected').attr('value')); 
      LSFactory.set('locationId', jQuery('#location option:selected').attr('data-id')); 
    }, function (error) {
      console.log(error);
      Loader.hide();
      
    });
     }
    $scope.paymentChoice = 'cod';
    $scope.location = LSFactory.get('location');
console.log($scope.location);
    var checkoutObj = LSFactory.get('checkout');

    $scope.cartGrandTotal = checkoutObj.payment.grandTotal;
    $scope.preOrder = { preOrder: false, date: '', time: '' };
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
      $cordovaDatePicker.show(options).then(function (date) {
        var sDate = new Date(date);
        $scope.preOrder.date = $filter('date')(sDate, 'yyyy-MM-dd');

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
      $cordovaDatePicker.show(options).then(function (time) {
        var sTime = new Date(time);
        $scope.preOrder.time = $filter('date')(sTime, 'HH:mm:ss');

      });

    }
    $scope.saveUser = function (userInfo, preOrder) {
      var tempUserObj = LSFactory.get('authUser') || {};
      tempUserObj.name = userInfo.name;
      tempUserObj.email = userInfo.email;
      tempUserObj.contact_no = userInfo.contact_no;
      tempUserObj.address_line1 = userInfo.address;
      tempUserObj.address_line2 = userInfo.add_line_2;
      tempUserObj.landmark = userInfo.landmark;
      tempUserObj.pincode = userInfo.pincode;
      tempUserObj.comments = userInfo.comments || '';
      tempUserObj.city = userInfo.city; 
      
      
      tempUserObj.location = LSFactory.get('location');
      if(!(LSFactory.get('locationId'))) {
         LSFactory.set('locationId', jQuery('#location option:selected').attr('data-id')); 
      }
      tempUserObj.locationId = LSFactory.get('locationId');
      tempUserObj.location = LSFactory.get('location');
      
      if (tempUserObj.id) {
        LSFactory.set('checkOutUser', tempUserObj);
      } else {
        LSFactory.set('tempUserObj', tempUserObj);

      }

      placeOrder();
    }

    function placeOrder() {
      Loader.show();
      var cartObj = LSFactory.get('cart');
      var shopObj = LSFactory.get('shop');
      var checkOut = LSFactory.get('checkout');
      var paymentObj = checkOut.payment;
      if ($scope.preOrder.date || $scope.preOrder.time) {
        paymentObj.delivery_date = $scope.preOrder.date;
        paymentObj.delivery_time = $scope.preOrder.time;
      } 
      var location = LSFactory.get('location');
      var userObj;
      if (LSFactory.get('checkOutUser')) {
        userObj = LSFactory.get('checkOutUser');
      } else {
        userObj = LSFactory.get('tempUserObj');
      }
      var finalOrder = { data: { shop: shopObj, items: cartObj, payment: paymentObj, user: userObj } }; 
      APIFactory.placeOrder(finalOrder).then(function (response) {
        Loader.hide();
        if (response.data.hd_order_details) {
          Loader.toast('Your order has been placed successfuly.');
          LSFactory.delete('cart');
          LSFactory.delete('shop');
          LSFactory.delete('checkout');
          LSFactory.delete('checkOutUser');
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $ionicHistory.clearHistory()
          $state.go('app.orders');
        }
      }, function (error) {
        Loader.hide();
        Loader.toast('Oops! something went wrong. Please try again');

      })
    }
  }]);