var app = angular.module('foodex.controllers', [])
app.controller('AppCtrl', ['$scope', '$rootScope', '$ionicModal', '$timeout', '$ionicPopup', '$state', '$q', 'LSFactory', 'UserService', '$ionicLoading', 'UserService', '$ionicActionSheet',
    function($scope, $rootScope, $ionicModal, $timeout, $ionicPopup, $state, $q, LSFactory, UserService, $ionicLoading, UserService, $ionicActionSheet) {
        var itemInCart = LSFactory.get('cart') || [];
        $rootScope.cartCount = itemInCart.length;
        $scope.showLogin = true;
        $scope.directClose = false; //if register button direct clicked
        //accordion
       $scope.clickButton = function () {
    var ionAutocompleteElement = document.getElementsByClassName("ion-autocomplete");
    angular.element(ionAutocompleteElement).controller('ionAutocomplete').fetchSearchQuery("", true);
    angular.element(ionAutocompleteElement).controller('ionAutocomplete').showModal();
}
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
            getFacebookProfileInfo(authResponse).then(function(profileInfo) {
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
            facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null, function(response) {
                console.log(response);
                info.resolve(response);
            }, function(response) {
                console.log(response);
                info.reject(response);
            });
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
                        getFacebookProfileInfo(success.authResponse).then(function(profileInfo) {
                            //for the purpose of this example I will store user data on local storage
                            UserService.setUser({
                                authResponse: success.authResponse,
                                userID: profileInfo.id,
                                name: profileInfo.name,
                                email: profileInfo.email,
                                picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                            });

                        $scope.user = UserService.getUser();

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
        $timeout(function(argument) {
             // body...  
        $scope.user = UserService.getUser();
        }, 100)

        // logout fb 
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
                        $state.go('app.home');
                    }, function(fail) {
                        $ionicLoading.hide();
                    });
                }
            });
        };
    }
]);



