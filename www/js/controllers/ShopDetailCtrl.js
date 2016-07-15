app.controller('ShopDetailCtrl', ['$scope', '$state', '$timeout', '$stateParams', 'LSFactory', '$rootScope', 'APIFactory', 'Loader', '$ionicPopup',
    function($scope, $state, $timeout, $stateParams, LSFactory, $rootScope, APIFactory, Loader, $ionicPopup) {
        "use strict";
        var shopId = $stateParams.shopId;
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) { 
             if(LSFactory.get('cart')){
                $scope.cartCount = (LSFactory.get('cart')).length;
             } else {
                $scope.cartCount = 0;     
             }
                console.log('changes')
          
        });
        $scope.getShopDetail = function() {
            var axis = LSFactory.get('axis');
            Loader.show();
            APIFactory.getShopDetail(shopId, axis).then(function(response) {
                $scope.shop = response.data.shop;
                $scope.menu = response.data.menu;
                $scope.shop.freeDeliveryAbove = response.data.shop.hd_delivery_charge;
                $scope.shop.hd_delivery_charge = response.data.delCharge;
                $scope.selectedCat = response.data.menu.parent[0].id;
                Loader.hide();
            }, function(error) {
                console.error(error);
                Loader.hide();
            });
        };
        $scope.getShopDetail();
      
        $scope.addToCart = function(item, shop, index, parentIndex) {
            var increaseQty = false;
            var increasedQty = null;
            var itemInCart = LSFactory.get('cart') || [];
            if (!itemInCart.length) {
                LSFactory.setArray('cart', item);
                LSFactory.set('shop', shop);
                Loader.toast(item.name + ' added to cart'); 
            } else {
                var shopCheck = LSFactory.get('shop');
                if (shopCheck.id === shop.id) {
                    var cart = LSFactory.get('cart');
                    angular.forEach(cart, function(element, index) {
                        if (element.id == item.id) {
                            increaseQty = true;
                            cart[index].status = parseInt(item.status) + parseInt(element.status);
                            increasedQty = cart[index].status;
                        }
                    });
                    if (increaseQty) {
                        LSFactory.set('cart', cart);
                        increaseQty = false;
                    } else {
                        cart.push(item); 
                    }
                    LSFactory.set('cart', cart);
                    Loader.toast(item.name + ' added to cart');

                } else {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Warning',
                        template: 'You can order from one shop at a time, if you add this item your previous cart will get clear.',
                    })
                    confirmPopup.then(function(res) {
                        if (res) {
                            LSFactory.delete('cart');
                            LSFactory.delete('shop');
                            LSFactory.setArray('cart', item);
                            LSFactory.set('shop', shop);
                            $scope.cartCount = (LSFactory.get('cart')).length;
                             Loader.toast(item.name + ' added to cart');

                        }
                    });
                }
            };
            $scope.cartCount = (LSFactory.get('cart')).length;  
            $scope.menu.parent[parentIndex].child[index].status = 1;
        };
    }
]);