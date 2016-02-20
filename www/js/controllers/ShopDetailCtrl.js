app.controller('ShopDetailCtrl', ['$scope', '$state', '$timeout', '$stateParams', 'LSFactory', '$rootScope', 'ShopService', 'Loader', '$ionicPopup', function($scope, $state, $timeout, $stateParams, LSFactory, $rootScope, ShopService, Loader, $ionicPopup) {
    Loader.showLoading();
    $timeout(function() {
        Loader.hideLoading();
    }, 2000);
    $scope.shopList = ShopService.getItems();
    $scope.selectedCat = 'Kaju Sweets';
    angular.forEach(LSFactory.get('Shops'), function(value, key) {
        if ($stateParams.shopId == value.id) {
            $scope.shop = value;
        }
    });
    $scope.addToCart = function(item, shop) {
        var itemInCart = LSFactory.get('cart') || [];
        if (!itemInCart.length) {
            LSFactory.setArray('cart', item);
            LSFactory.setArray('shop', shop);
        } else {
            var shopCheck = LSFactory.get('shop');
            if (shopCheck[0].id === shop.id) {
                var cart = LSFactory.get('cart');
                cart.push(item);
                LSFactory.set('cart', cart);
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
                        LSFactory.setArray('shop', shop);
                        $rootScope.cartCount = (LSFactory.get('cart')).length;
                    }  
                });
            }
        }
        $rootScope.cartCount = (LSFactory.get('cart')).length;
    }
}]);