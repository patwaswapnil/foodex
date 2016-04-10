app.controller('ShopInfoCtrl', ['$scope', '$state', '$timeout', '$stateParams', 'LSFactory', '$rootScope', 'APIFactory', 'Loader', '$ionicPopup', function($scope, $state, $timeout, $stateParams, LSFactory, $rootScope, APIFactory, Loader, $ionicPopup) {
    
    var shopId = $stateParams.shopId;
    var axis = LSFactory.get('axis');
    $scope.getShopDetail = function () {
    APIFactory.getShopDetail(shopId, axis).then(function (response) {
    Loader.show();
         $scope.shop = response.data.shop;   
         console.log(response);
         Loader.hide();
    }, function (error) {
         console.error(error);
         Loader.hide();
    })
}
 $scope.getShopDetail();

}])