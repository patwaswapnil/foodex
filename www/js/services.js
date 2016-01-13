angular.module('foodex.services', [])
.service('UserService', function() {

//for the purpose of this example I will store user data on ionic local storage but you should save it on a database

  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
})
.factory('Loader', ['$ionicLoading', '$timeout', function($ionicLoading, $timeout) {

    var LOADERAPI = {

        showLoading: function(text) {
            text = text || 'Loading...';
            $ionicLoading.show({
                template: text
            });
        },

        hideLoading: function() {
            $ionicLoading.hide();
        },

        toggleLoadingWithMessage: function(text, timeout) {
            var self = this;

            self.showLoading(text);

            $timeout(function() {
                self.hideLoading();
            }, timeout || 3000);
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

        delete: function(key) {
            return localStorage.removeItem(key);
        },

        getAll: function() {
            var books = [];
            var items = Object.keys(localStorage);

            for (var i = 0; i < items.length; i++) {
                if (items[i] !== 'user' || items[i] != 'token') {
                    books.push(JSON.parse(localStorage[items[i]]));
                }
            }

            return books;
        }

    };

    return LSAPI;

}])
