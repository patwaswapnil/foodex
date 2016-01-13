var app = angular.module('foodex.controllers', [])

app.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$ionicPopup', '$state', '$q', 'UserService', '$ionicLoading', 'UserService', '$ionicActionSheet' ,
  function($scope, $ionicModal, $timeout, $ionicPopup, $state, $q, UserService, $ionicLoading, UserService, $ionicActionSheet) {

    $scope.showLogin = true;
    $scope.directClose = false; //if register button direct clicked
    //accordion
    $scope.groups = [{
        name: 'Sweets',
        items: ['Bangali Sweet']
    }, {
        name: 'Farsan',
        items: ['Ganthiya']
    }, {
        name: 'Homemade',
        items: ['Sev']
    }];

    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

    //end accor
    $scope.registerToggle = function() {
        if ($scope.directClose == true) {
            $scope.modal.hide();
            $scope.showLogin = !$scope.showLogin;
        } else {
            $scope.showLogin = !$scope.showLogin;
        }
    }
    $scope.registerOpen = function() {
        $scope.showLogin = !$scope.showLogin;
        $scope.directClose = false;
    }
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };
    $scope.login = function() {
        $scope.modal.show();
    };
    $scope.registerShow = function() {
        $scope.showLogin = false;
        $scope.directClose = true;

        $scope.modal.show();
    };

    $scope.resetPwd = function() {
        $scope.data = {}

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="email" ng-model="data.email" placeholder="Enter you email" class="padding">',
            title: 'Enter your email address',
            subTitle: 'You will get a link to reset password',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                type: 'fs12'
            }, {
                text: 'Submit',
                type: 'button-balanced fs12',
                onTap: function(e) {
                    if (!$scope.data.email) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.data.email;
                    }
                }
            }, ]
        });
        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });

    };
    //This is the success callback from the login method
    var fbLoginSuccess = function(response) {
        if (!response.authResponse) {
            fbLoginError("Cannot find the authResponse");
            return;
        }

        var authResponse = response.authResponse;

        getFacebookProfileInfo(authResponse)
            .then(function(profileInfo) {
                //for the purpose of this example I will store user data on local storage
                UserService.setUser({
                    authResponse: authResponse,
                    userID: profileInfo.id,
                    name: profileInfo.name,
                    email: profileInfo.email,
                    picture: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                });

                $ionicLoading.hide();
                $state.go('app.home');

            }, function(fail) {
                //fail get profile info
                console.log('profile info fail', fail);
            });
    };


    //This is the fail callback from the login method
    var fbLoginError = function(error) {
        console.log('fbLoginError', error);
        $ionicLoading.hide();
    };

    //this method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function(authResponse) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
            function(response) {
                console.log(response);
                info.resolve(response);
            },
            function(response) {
                console.log(response);
                info.reject(response);
            }
        );
        return info.promise;
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {

        facebookConnectPlugin.getLoginStatus(function(success) {
            if (success.status === 'connected') {
                // the user is logged in and has authenticated your app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed request, and the time the access token
                // and signed request each expire
                console.log('getLoginStatus', success.status);

                //check if we have our user saved
                var user = UserService.getUser('facebook');

                if (!user.userID) {
                    getFacebookProfileInfo(success.authResponse)
                        .then(function(profileInfo) {

                            //for the purpose of this example I will store user data on local storage
                            UserService.setUser({
                                authResponse: success.authResponse,
                                userID: profileInfo.id,
                                name: profileInfo.name,
                                email: profileInfo.email,
                                picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                            });

                            $state.go('app.home');

                        }, function(fail) {
                            //fail get profile info
                            console.log('profile info fail', fail);
                        });
                } else {
                    $state.go('app.home');
                }

            } else {
                //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
                //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
                console.log('getLoginStatus', success.status);

                $ionicLoading.show({
                    template: 'Logging in...'
                });

                //ask the permissions you need. You can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
            }
        });
    };


    // logout fb
    $scope.user = UserService.getUser();

    $scope.showLogOutMenu = function() {
        var hideSheet = $ionicActionSheet.show({
            destructiveText: 'Logout',
            titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
            cancelText: 'Cancel',
            cancel: function() {},
            buttonClicked: function(index) {
                return true;
            },
            destructiveButtonClicked: function() {
                $ionicLoading.show({
                    template: 'Logging out...'
                });

                // Facebook logout
                facebookConnectPlugin.logout(function() {
                        $ionicLoading.hide();
                        $state.go('app.location');
                    },
                    function(fail) {
                        $ionicLoading.hide();
                    });
            }
        });
    };
}]);
app.controller('LocationCtrl', ['$scope', function($scope) {


    $scope.model = "";

    $scope.getTestItems = function(query) {
        if (query) {
            return {
                items: [

                    {
                        id: "3",
                        name: query + "3",
                        view: "Location: " + query + "3"
                    }
                ]
            };
        }
        return {
            items: []
        };
    }

}]);

app.controller('HomeCtrl', ['$scope', '$state', '$timeout', 'Loader', function($scope, $state, $timeout, Loader) {

    $scope.navTitle = 'Vidhyavihar West';
}]);

app.controller('ShopListingCtrl', ['$scope', '$state', 'LSFactory', function($scope, $state, LSFactory) {

    $scope.navTitle = 'Shops';
    $scope.shops = [{
        id: 1,
        name: 'Haldiram',
        image: 'shop2.jpg',
        rating: 80,
        deliveryCharge: 0,
        deliveryTime: 40,
        minOrder: 200,
        ratingCount: 22,
        items: ['Sweets', 'Farsaan']
    }, {
        id: 2,
        name: 'MM Mithaiwala',
        image: 'shop3.jpg',
        rating: 70,
        deliveryCharge: 0,
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
        deliveryCharge: 10,
        deliveryTime: 90,
        minOrder: 200,
        ratingCount: 22,
        items: ['Farsan']
    }, {
        id: 5,
        name: 'Haldiram',
        image: 'shop2.jpg',
        rating: 80,
        deliveryCharge: 0,
        deliveryTime: 40,
        minOrder: 200,
        ratingCount: 22,
        items: ['Sweets', 'Farsaan']
    }, {
        id: 6,
        name: 'MM Mithaiwala',
        image: 'shop3.jpg',
        rating: 70,
        deliveryCharge: 0,
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
        deliveryCharge: 0,
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
app.controller('ShopDetailCtrl', ['$scope', '$state', '$stateParams', 'LSFactory',function($scope, $state, $stateParams, LSFactory) {

        $scope.navTitle = '';
        $scope.quantity = 4;

        angular.forEach(LSFactory.get('Shops'), function(value, key) {

            if ($stateParams.shopId == value.id) {

                $scope.shop = value;
            }
        });
    }
]);
app.controller('CartCtrl', ['$scope', '$state', '$stateParams', 'LSFactory',function($scope, $state, $stateParams, LSFactory) {

        $scope.navTitle = 'Cart';
    }
]);
app.directive('counter', function() {
    return {
        restrict: 'A',
        scope: { value: '=value' },
        template: '<button class="button button-small icon ion-minus cart-btn " ng-click="minus()"> </button>\
                  <input type="text" class="cart-btn qty-input " ng-model="value" ng-change="changed()" ng-readonly="readonly">\
                  <button    class="button button-small icon ion-plus cart-btn " ng-click="plus()"> </button>',
        link: function( scope , element , attributes ) {
            // Make sure the value attribute is not missing.
            if ( angular.isUndefined(scope.value) ) {
                throw "Missing the value attribute on the counter directive.";
            }
            
            var min = angular.isUndefined(attributes.min) ? null : parseInt(attributes.min);
            var max = angular.isUndefined(attributes.max) ? null : parseInt(attributes.max);
            var step = angular.isUndefined(attributes.step) ? 1 : parseInt(attributes.step);
            
            element.addClass('counter-container');
            
            // If the 'editable' attribute is set, we will make the field editable.
            scope.readonly = angular.isUndefined(attributes.editable) ? true : false;
            
            /**
             * Sets the value as an integer.
             */
            var setValue = function( val ) {
                scope.value = parseInt( val );
            }
            
            // Set the value initially, as an integer.
            setValue( scope.value );
            
            /**
             * Decrement the value and make sure we stay within the limits, if defined.
             */
            scope.minus = function() {
                if ( min && (scope.value <= min || scope.value - step <= min) || min === 0 && scope.value < 1 ) {
                    setValue( min );
                    return false;
                }
                setValue( scope.value - step );
            };
            
            /**
             * Increment the value and make sure we stay within the limits, if defined.
             */
            scope.plus = function() {
                if ( max && (scope.value >= max || scope.value + step >= max) ) {
                    setValue( max );
                    return false;
                }
                setValue( scope.value + step );
            };
            
            /**
             * This is only triggered when the field is manually edited by the user.
             * Where we can perform some validation and make sure that they enter the
             * correct values from within the restrictions.
             */
            scope.changed = function() {
                // If the user decides to delete the number, we will set it to 0.
                if ( !scope.value ) setValue( 0 );
                
                // Check if what's typed is numeric or if it has any letters.
                if ( /[0-9]/.test(scope.value) ) {
                    setValue( scope.value );
                }
                else {
                    setValue( scope.min );
                }
                
                // If a minimum is set, let's make sure we're within the limit.
                if ( min && (scope.value <= min || scope.value - step <= min) ) {
                    setValue( min );
                    return false;
                }
                
                // If a maximum is set, let's make sure we're within the limit.
                if ( max && (scope.value >= max || scope.value + step >= max) ) {
                    setValue( max );
                    return false;
                }
                
                // Re-set the value as an integer.
                setValue( scope.value );
            };
        }
    }
});