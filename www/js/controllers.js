var app = angular.module('foodex.controllers', [])
app.controller('AppCtrl', ['$scope', '$rootScope', '$ionicModal', '$timeout', '$ionicPopup', '$state', '$q', 'LSFactory', '$ionicLoading', 'UserService', '$ionicActionSheet', 'Loader', 'APIFactory', '$cordovaOauth', '$cordovaInAppBrowser', '$http', '$ionicHistory',
    function ($scope, $rootScope, $ionicModal, $timeout, $ionicPopup, $state, $q, LSFactory, $ionicLoading, UserService, $ionicActionSheet, Loader, APIFactory, $cordovaOauth, $cordovaInAppBrowser, $http, $ionicHistory) {
        $scope.imgPath = 'http://pethjinni.com/uploads/';
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
        $scope.set_star = function (number) {
            var star = number * 20;
            return { width: star + '%' }

        }
        $scope.updateUser = function () {
            if (LSFactory.get('authUser')) {
                $rootScope.isLoggedIn = true;
                $timeout(function () {
                    $rootScope.appUser = LSFactory.get('authUser');
                    $rootScope.isLoggedIn = true;
                }, 50);
            } else {
                $timeout(function () {
                    $rootScope.appUser = {};
                    $rootScope.isLoggedIn = false;
                }, 50);
            }
        }
        $scope.updateUser();
        $scope.$on('showLoginModal', function ($event, scope, cancelCallback, callback) {
            $scope.showLogin = true;
            $scope.registerToggle = function () {
                $scope.showLogin = !$scope.showLogin;
            }
            $scope = scope || $scope;
            $scope.viewLogin = true;
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();

                $scope.hide = function () {
                    $scope.modal.hide();
                    if (typeof cancelCallback === 'function') {
                        cancelCallback();
                    }
                }
                $scope.authUser = function (data) {
                    console.log(data)
                    Loader.show('Authenticating');
                    APIFactory.authUser(data).then(function (response) {
                        console.log(response.data);
                        if (response.data.error == 'werror') {
                            Loader.toggleLoadingWithMessage('Invalid Username or Password', 2000);
                        } else if (response.data.error == 'success') {
                            Loader.toggleLoadingWithMessage('Authentication Successful', 1500);
                            $scope.modal.hide();
                            LSFactory.set('authUser', response.data.data)
                            $scope.updateUser();
                            $scope.formUser = {};
                            if (typeof callback === 'function') {
                                callback();
                            }
                        } else {
                            Loader.toggleLoadingWithMessage('Oops! something went wrong. Please try again', 2000);
                        }
                    }, function (error) {
                        console.error(error)
                    })
                }
                $scope.registerUserr = function (data) {
                    Loader.show('Registering');
                    APIFactory.registerUser(data).then(function (response) {
                        console.log(response.data.error);
                        if (response.data.error == 'error' && response.data.emailError == 'The email has already been taken.') {
                            Loader.toggleLoadingWithMessage('Email is already registered!', 2000);
                        }
                        else if (response.data.error == 'error' && response.data.pass_confirmError == 'The pass confirm and pass must match.') {
                            Loader.toggleLoadingWithMessage('Password and confirm password mismatch', 2000);
                            $scope.userData.pass = '';
                            $scope.userData.pass_confirm = '';
                        } else if (response.data.error == 'error') {
                            Loader.toggleLoadingWithMessage('Opps! something went wrong', 2000);
                            $scope.userData.pass = '';
                            $scope.userData.pass_confirm = '';
                        } else if (response.data.error == 'success') {
                            Loader.toggleLoadingWithMessage('Registration Successful', 1500);
                            $scope.userData = {};
                            var cred = { email: data.email, password: data.pass };
                            $scope.authUser(cred);
                        } else { Loader.toggleLoadingWithMessage('Opps! something went wrong', 1500); }
                    }, function (error) {
                        Loader.toggleLoadingWithMessage('Opps! something went wrong', 1500);
                        console.error(error)
                    })
                }
                $scope.facebookLogin = function () {
                    Loader.show();
                    $cordovaOauth.facebook("254398101561891", ["email", "public_profile"], {
                        redirect_uri: "http://localhost/callback"
                    }).then(function (result) {
                        $http.get("https://graph.facebook.com/v2.2/me", {
                            params: {
                                access_token: result.access_token,
                                fields: "name,first_name,last_name,location,picture,email",
                                format: "json"
                            }
                        }).then(function (result) {
                            console.log(result);
                            $scope.data = {
                                "data": {
                                    "data": {
                                        "email": result.data.email,
                                        "name": result.data.name,
                                        "id": result.data.id,
                                        "img": result.data.picture.data.url,
                                        "gender": result.data.gender
                                    }
                                }
                            };
                            APIFactory.socialRegister($scope.data).then(function (response) {
                                $scope.modal.hide();
                                Loader.hide();
                                Loader.toast('Logged in successfuly');
                                LSFactory.set('authUser', response.data.data)
                                $scope.updateUser();
                                if (typeof callback === 'function') {
                                    callback();
                                }
                            }, function (error) {
                                Loader.hide();
                            })
                        }, function (error) {
                            Loader.hide();
                        });
                    }, function (error) {
                        Loader.hide();
                        console.log(error);
                    });
                }
            });

        });

        $scope.loginFromMenu = function () {
            $rootScope.$broadcast('showLoginModal', $scope, null, null);
        }
        $scope.resetPwd = function () {
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
                        type: 'button-balanced foodex-primary foodex-bar fs12',
                        onTap: function (e) {
                            if (!$scope.data.email) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data;
                            }
                        }
                    },]
            });
            myPopup.then(function (data) {
                if (!data) {
                    return false;
                }
                Loader.show();
                APIFactory.resetPwd(data).then(function (response) {
                    if (response.data.error == 'success') {
                        Loader.toggleLoadingWithMessage('Your password reset link has been sent to your email Id');
                    }
                    else {
                        Loader.toggleLoadingWithMessage('This Email Id is not registered');
                    }
                }, function (error) {
                    console.error(error);
                    Loader.toggleLoadingWithMessage('Somwthing went wrong. Please try later');
                })
            });
        };



        $scope.showLogOutMenu = function () {
            var hideSheet = $ionicActionSheet.show({
                destructiveText: '<i class="icon ion-log-out assertive valm"></i> Logout',
                titleText: 'Are you sure you want to logout?',
                cancelText: 'Cancel',
                cancel: function () { },
                buttonClicked: function (index) {
                    return true;
                },
                destructiveButtonClicked: function () {
                    Loader.show();
                    LSFactory.delete('authUser');
                    hideSheet();
                    $scope.updateUser();
                    $timeout(function (argument) {
                        Loader.toggleLoadingWithMessage('Logged Out Successfully', 1500);
                        $state.go('app.home');

                    }, 1000);
                }
            });
        };
        $scope.getTotalQty = function (product) {
            var itemQty;
            if (product.unit_type == null) {
                return false;
            }
            if (product.unit_type.search('Gms') != -1) {
                itemQty = parseInt((product.unit_type.match(/\d/g)).join(''));
                var totalQty = product.status * itemQty;
                if (totalQty >= 1000) {
                    product.totalQty = totalQty / 1000 + ' Kg';
                } else {
                    product.totalQty = totalQty + ' Gms';
                }
            } else {
                itemQty = 1;
                var removePer = product.unit_type.replace('PER' || 'Per' || 'per', '');
                var getUnit = removePer.replace(/[0-9]/g, '');
                var totalItemQty = (itemQty * product.status);
                product.totalQty = totalItemQty + ' ' + getUnit;
            }
        };
        $scope.changeLocation = function () {

            var confirmPopup1 = $ionicPopup.confirm({
                title: 'Alert',
                template: 'Do you want to change the location?',
                okText: 'YES'
            });
            confirmPopup1.then(function (res) {
                if (res) {
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true
                    })
                    $state.go('app.location');
                }
            });
        }
    }
]);
