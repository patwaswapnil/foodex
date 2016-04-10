var domain = 'http://foodex.cruxservers.in/';
// var domain = 'http://foodex.dev/';
var imgPath = 'http://foodex.dev/';
angular.module('foodex', ['ionic', 'ngCordova', 'foodex.controllers', 'foodex.services', 'ion-autocomplete', 'ngCordovaOauth'])
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
        $cordovaStatusbar.styleHex('#027158');
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
        .state('app.delivery', {
            url: '/delivery',
            views: {
                'menuContent': {
                    templateUrl: 'templates/delivery.html',
                    controller: 'DeliveryCtrl'
                }
            }
        })
        .state('app.payment', {
            url: '/payment',
            views: {
                'menuContent': {
                    templateUrl: 'templates/payment.html',
                    controller: 'PaymentCtrl'
                }
            }
        })
        .state('app.shop-info', {
            url: '/shop-info/:shopId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/shop-info.html',
                    controller: 'ShopInfoCtrl'
                }
            }
        })
        .state('app.orders', {
            url: '/orders',
            views: {
                'menuContent': {
                    templateUrl: 'templates/orders.html',
                    controller: 'OrdersCtrl'

                }
            }
        })
        .state('app.order-confirmation', {
            url: '/order-confirmation',
            views: {
                'menuContent': {
                    templateUrl: 'templates/order-confirmation.html' 

                }
            }
        })
          .state('app.user-profile', {
            url: '/user-profile',
            views: {
              'menuContent': {
                templateUrl: 'templates/user-profile.html',
                controller: 'OrdersCtrl'
              }
            }
          })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/location');
});
