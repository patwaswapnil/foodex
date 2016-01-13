angular.module('foodex', ['ionic', 'ngCordova', 'foodex.controllers', 'foodex.services', 'ion-autocomplete'])

.run(function($ionicPlatform, $cordovaStatusbar) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
    $cordovaStatusbar.overlaysWebView(true)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        $cordovaStatusbar.styleHex('#28A54C');
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })
        .state('app.location', {
            url: '/location',
            views: {
                'menuContent': {
                    templateUrl: 'templates/location.html',
                    controller: 'LocationCtrl'
                }
            }
        })
        .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('app.shops', {
            url: '/shops',
            views: {
                'menuContent': {
                    templateUrl: 'templates/shops-listing.html',
                    controller: 'ShopListingCtrl'
                }
            }
        })
        .state('app.shop', {
            url: '/shop/:shopId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/shop-detail.html',
                    controller: 'ShopDetailCtrl'
                }
            }
        })
        .state('app.cart', {
            url: '/cart',
            views: {
                'menuContent': {
                    templateUrl: 'templates/cart.html',
                    controller: 'CartCtrl'
                }
            }
        })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
