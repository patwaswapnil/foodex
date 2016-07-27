var domain = 'http://pethjinni.com/';
// var domain = 'http://foodex.dev/';
var imgPath = 'http://foodex.dev/';
angular.module('foodex', ['ionic','ionic.service.core', 'ngCordova', 'foodex.controllers', 'foodex.services', 'ion-autocomplete', 'ngCordovaOauth', 'ionic.service.analytics'])
.run(function($ionicPlatform, $cordovaStatusbar, $ionicAnalytics) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
    setTimeout(function() {
      try { 
        navigator.splashscreen.hide();
      } catch(e) { 
        console.log('It will work on app only');
      }
    }, 3000);
        $cordovaStatusbar.overlaysWebView(true)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

    }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        $cordovaStatusbar.styleHex();
    });
     //for ionic analytics
    $ionicAnalytics.register();
    //for ionic push
try {
      var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:",token.token);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });
} catch(e) {
    // statements
    console.error(e);
} 
    //push
 
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
        .state('app.offers', {
            url: '/offers',
            views: {
                'menuContent': {
                    templateUrl: 'templates/offers.html' 

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
