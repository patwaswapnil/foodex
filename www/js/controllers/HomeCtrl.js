app.controller('HomeCtrl', ['$scope', '$state', '$timeout', 'Loader', 'LSFactory', '$ionicHistory', '$ionicPopover', function($scope, $state, $timeout, Loader, LSFactory, $ionicHistory, $ionicPopover) {
    $scope.navTitle = LSFactory.get('location');
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
 if(fromState.name == "app.location"){
    $scope.navTitle = LSFactory.get('location');
 }
$ionicHistory.clearCache().then(function(response){
console.log('cleared history');
})
})


    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.shops = [{
        id: 1,
        name: 'Saroj Sweets',
        image: 'shop2.png',
        rating: 80,
        deliveryCharge: 100,
        deliveryTime: 40,
        minOrder: 200,
        ratingCount: 22,
        items: ['Sweets', 'Farsaan']
    }, {
        id: 2,
        name: 'MM Mithaiwala',
        image: 'shop3.jpg',
        rating: 70,
        deliveryCharge: 50,
        deliveryTime: 60,
        minOrder: 200,
        ratingCount: 22,
        items: ['Sweets']
    }, {
        id: 3,
        name: 'Suleman',
        image: 'shop4.jpg',
        rating: 50,
        deliveryCharge: 100,
        deliveryTime: 90,
        minOrder: 200,
        ratingCount: 22,
        items: ['Farsan']
    }, {
        id: 4,
        name: 'Adarsh Sweets',
        image: 'shop5.jpg',
        rating: 90,
        deliveryCharge: 40,
        deliveryTime: 90,
        minOrder: 200,
        ratingCount: 22,
        items: ['Farsan']
    }, {
        id: 5,
        name: 'Haldiram',
        image: 'shop2.jpg',
        rating: 80,
        deliveryCharge: 60,
        deliveryTime: 40,
        minOrder: 200,
        ratingCount: 22,
        items: ['Sweets', 'Farsaan']
    }, {
        id: 6,
        name: 'MM Mithaiwala',
        image: 'shop3.jpg',
        rating: 70,
        deliveryCharge: 80,
        deliveryTime: 60,
        minOrder: 200,
        ratingCount: 22,
        items: ['Sweets']
    }, {
        id: 7,
        name: 'Suleman',
        image: 'shop4.jpg',
        rating: 50,
        deliveryCharge: 50,
        deliveryTime: 90,
        minOrder: 200,
        ratingCount: 22,
        items: ['Farsan']
    }, {
        id: 8,
        name: 'Adarsh Sweets',
        image: 'shop5.jpg',
        rating: 90,
        deliveryCharge: 100,
        deliveryTime: 90,
        minOrder: 200,
        ratingCount: 22,
        items: ['Farsan']
    }, {
        id: 9,
        name: 'Haldiram',
        image: 'shop2.jpg',
        rating: 80,
        deliveryCharge: 0,
        deliveryTime: 40,
        minOrder: 200,
        ratingCount: 22,
        items: ['Sweets', 'Farsaan']
    }, {
        id: 10,
        name: 'MM Mithaiwala',
        image: 'shop3.jpg',
        rating: 25,
        deliveryCharge: 90,
        deliveryTime: 60,
        minOrder: 200,
        ratingCount: 22,
        items: ['Sweets']
    }, {
        id: 11,
        name: 'Suleman',
        image: 'shop4.jpg',
        rating: 68,
        deliveryCharge: 100,
        deliveryTime: 90,
        minOrder: 200,
        ratingCount: 22,
        items: ['Farsan']
    }, {
        id: 12,
        name: 'Adarsh Sweets',
        image: 'shop5.jpg',
        rating: 54,
        deliveryCharge: 100,
        deliveryTime: 90,
        minOrder: 200,
        ratingCount: 22,
        items: ['Farsan']
    }];
    if (!LSFactory.get('Shops')) {
        LSFactory.set('Shops', $scope.shops);
    }
}]);