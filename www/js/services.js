angular.module('foodex.services', [])
.service('UserService', function() {

        //for the purpose of this example I will store user data on ionic local storage but you should save it on a database

        var setUser = function(user_data) {
            window.localStorage.starter_facebook_user = JSON.stringify(user_data);
        };

        var getUser = function() {
            return JSON.parse(window.localStorage.starter_facebook_user || '{}');
        };

        return {
            getUser: getUser,
            setUser: setUser
        };
    })
// .factory('oAuth', ['$cordovaOauth', 'LSFactory', function($cordovaOauth, LSFactory) {

//         //for the purpose of this example I will store user data on ionic local storage but you should save it on a database

//         var fbLogin = function(data) {
//              return $cordovaOauth.facebook("254398101561891", ["email", "public_profile"],  {redirect_uri: "/callback"});
//         };

       
//     }])
.factory('Loader', ['$ionicLoading', '$timeout', '$cordovaToast', function($ionicLoading, $timeout, $cordovaToast) {

        var LOADERAPI = {

            show: function(text) {
                if(text){
                $ionicLoading.show({
                    template: text
                });
            }else {
                $ionicLoading.show();
            }
            },

            hide: function() {
                $ionicLoading.hide();
            },

           toggleLoadingWithMessage: function(text, timeout) {
                var self = this;
                self.show(text);
                $timeout(function() {
                    self.hide();
                }, timeout || 3000);
            },

            toast: function (msg) {   
                var isAndroid = ionic.Platform.isAndroid();
                var isIOS = ionic.Platform.isIOS();
                if (isAndroid || isIOS) {
                 $cordovaToast.show(msg, 'short', 'center').then(function(success) {});    
                } 
                else {
                    alert(msg);
                }
            }

        };
        return LOADERAPI;
}])
.factory('LSFactory', [function() {

        var LSAPI = {

            clear: function() {
                return localStorage.clear();
            },

            get: function(key) {
                return JSON.parse(localStorage.getItem(key));
            },

            set: function(key, data) {
                return localStorage.setItem(key, JSON.stringify(data));
            },
            setArray: function(key, data) {
                return localStorage.setItem(key, JSON.stringify([data]));
            },
            delete: function(key) {
                return localStorage.removeItem(key);
            },

            getAll: function() {
               
            }

        };

        return LSAPI;

    }]) 
.factory('APIFactory', ['$http', '$httpParamSerializer', function ($http, $httpParamSerializer) {
    var api = {
        getShops : function (data) {
            return $http.get(domain+'app/shops?search_rest='+data.location, {cache:false});
        }, 
        getShopDetail : function (shopId, axis) {
            return $http.get(domain+'app/shop/'+shopId+'?lat='+axis.lat+'&long='+axis.long);
        }, 
        authUser : function (data) {
            var req = {method: 'POST', url: domain+'login', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
            return $http(req);
        }, 
        registerUser : function (data) {
            var req = {method: 'POST', url: domain+'register', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
            return $http(req);
        }, 
        resetPwd : function (data) {
            var req = {method: 'POST', url: domain+'forgetpassword', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
            return $http(req);
        },
        updateUser : function (data) {
            var req = {method: 'POST', url: domain+'app/get_user_details/'+data.id, headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
            return $http(req);
        },
        changePassword : function (data) {
            var req = {method: 'POST', url: domain+'app/user_change_password/'+data.id, headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
            return $http(req);
        },
        searchLocation: function (location) {
            return $http.get(domain+'search_restaurant?location='+location);
        },
        placeOrder: function (data) { 
            return $http.post(domain+'app/place-order', data);
            
        },
        getShopLocationById: function (id) { 
            return $http.get(domain+'app/get_tag_location/'+id); 
        },
        orderHistory: function (user) { 
            return $http.get(domain+'app/order_details/'+user.id); 
        },
        socialRegister: function (data) { 
            var req = {method: 'POST', url: domain+'app/fb_login', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
            return $http(req);
        }
    };
    return api;
}])