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
app.controller('LocationCtrl', ['$scope', '$state', '$cordovaGeolocation', '$http', '$ionicHistory', 'LSFactory', '$filter', 'Loader', function($scope, $state, $cordovaGeolocation, $http, $ionicHistory, LSFactory, $filter, Loader) {
   $scope.locationMaster = [{"id":1,"location":"Mira Road"},{"id":1,"location":"Chembur"},{"id":1,"location":"Andheri West"},{"id":1,"location":"Kharghar"},{"id":1,"location":"Malad West"},{"id":1,"location":"Andheri East"},{"id":1,"location":"Bandra West"},{"id":1,"location":"Goregaon West"},{"id":1,"location":"Kandivali East"},{"id":1,"location":"Ghodbunder Road"},{"id":1,"location":"Navi Mumbai"},{"id":1,"location":"Bhandup West"},{"id":1,"location":"Borivali West"},{"id":1,"location":"Panvel"},{"id":1,"location":"Khar East"},{"id":1,"location":"Kandivali West"},{"id":1,"location":"Goregaon East"},{"id":1,"location":"90 Feet Road"},{"id":1,"location":"Nelson Manickam Road"},{"id":1,"location":"Abdul Rehman Street"},{"id":1,"location":"Agripada"},{"id":1,"location":"Airoli"},{"id":1,"location":"Airoli Sector 4"},{"id":1,"location":"Airoli Sector 8"},{"id":1,"location":"Altamount Road"},{"id":1,"location":"Ambarnath"},{"id":1,"location":"Ambarnath East"},{"id":1,"location":"Ambernath West"},{"id":1,"location":"Amboli"},{"id":1,"location":"Andheri Kurla Road"},{"id":1,"location":"Andheri Sahar Road"},{"id":1,"location":"Antop Hill"},{"id":1,"location":"Apollo Bunder"},{"id":1,"location":"August Kranti Maidan"},{"id":1,"location":"Babulnath Road"},{"id":1,"location":"Badlapur"},{"id":1,"location":"Ballard Estate"},{"id":1,"location":"Bandra East"},{"id":1,"location":"Belapur"},{"id":1,"location":"Bhandup"},{"id":1,"location":"Bhandup East"},{"id":1,"location":"Bhayandar"},{"id":1,"location":"Bhayandar East"},{"id":1,"location":"Bhayandar Wada"},{"id":1,"location":"Bhayandar West"},{"id":1,"location":"Bhayander"},{"id":1,"location":"Bhayander East"},{"id":1,"location":"Bhayander West"},{"id":1,"location":"Bhindi Bazaar"},{"id":1,"location":"Bhiwandi"},{"id":1,"location":"Bhoiwada"},{"id":1,"location":"Bhulabhai Desai Road"},{"id":1,"location":"Bhuleshwar"},{"id":1,"location":"Bhyandar East"},{"id":1,"location":"Boisar"},{"id":1,"location":"Boisar West"},{"id":1,"location":"Borivali"},{"id":1,"location":"Borivali East"},{"id":1,"location":"Breach Candy"},{"id":1,"location":"Byculla"},{"id":1,"location":"Byculla East"},{"id":1,"location":"Byculla West"},{"id":1,"location":"CP Tank"},{"id":1,"location":"Chhatrapati Shivaji Terminus"},{"id":1,"location":"Carnac Bunder"},{"id":1,"location":"CBD Belapur"},{"id":1,"location":"CBD Belapur Sector 11"},{"id":1,"location":"Chakala"},{"id":1,"location":"Chandivali"},{"id":1,"location":"Charkop"},{"id":1,"location":"Charni Road"},{"id":1,"location":"Charni Road East"},{"id":1,"location":"Chembur Camp"},{"id":1,"location":"Chembur Colony"},{"id":1,"location":"Chembur East"},{"id":1,"location":"Chembur West"},{"id":1,"location":"Chinch Bandar"},{"id":1,"location":"Chinch Bunder"},{"id":1,"location":"Chinchpokli"},{"id":1,"location":"Chinchpokli East"},{"id":1,"location":"Chinchpokli West"},{"id":1,"location":"Chira Bazaar"},{"id":1,"location":"Chowpatti"},{"id":1,"location":"Chuna Bhatti"},{"id":1,"location":"Churchgate"},{"id":1,"location":"Colaba Causeway"},{"id":1,"location":"Cotton Green"},{"id":1,"location":"Cotton Green West"},{"id":1,"location":"Crawford Market"},{"id":1,"location":"Cuffe Parade"},{"id":1,"location":"Cumbala Hill"},{"id":1,"location":"Currey Road"},{"id":1,"location":"Dadabhai Naoroji Road"},{"id":1,"location":"Dadar East"},{"id":1,"location":"Dadar T T"},{"id":1,"location":"Dadar West"},{"id":1,"location":"Dahisar"},{"id":1,"location":"Dahisar East"},{"id":1,"location":"Dahisar West"},{"id":1,"location":"Dana Bunder"},{"id":1,"location":"Delisle Road"},{"id":1,"location":"Deonar"},{"id":1,"location":"Deonar East"},{"id":1,"location":"Dharavi"},{"id":1,"location":"Dhobhi Talao"},{"id":1,"location":"Dhobi Talao"},{"id":1,"location":"Dockyard"},{"id":1,"location":"Dombivali"},{"id":1,"location":"Dombivali East"},{"id":1,"location":"Dombivali West"},{"id":1,"location":"Dongri"},{"id":1,"location":"Elphinstone Road"},{"id":1,"location":"Flora Fountain"},{"id":1,"location":"Fort"},{"id":1,"location":"Gamdevi"},{"id":1,"location":"Ghansoli"},{"id":1,"location":"Ghatkopar"},{"id":1,"location":"Ghatkopar East"},{"id":1,"location":"Ghatkopar West"},{"id":1,"location":"Ghodbandar Road"},{"id":1,"location":"Girgaon"},{"id":1,"location":"Girgaon Chowpatty"},{"id":1,"location":"Girgaum"},{"id":1,"location":"Goregaon East"},{"id":1,"location":"Goregaon West"},{"id":1,"location":"Govandi"},{"id":1,"location":"Govandi East"},{"id":1,"location":"Govandi West"},{"id":1,"location":"Gowalia Tank"},{"id":1,"location":"Grant Road"},{"id":1,"location":"Grant Road East"},{"id":1,"location":"Grant Road West"},{"id":1,"location":"Green Park Extension"},{"id":1,"location":"Gulalwadi"},{"id":1,"location":"Haji Ali"},{"id":1,"location":"Horiman Circle"},{"id":1,"location":"Hughes Road"},{"id":1,"location":"Hutatma Chowk"},{"id":1,"location":"J B Nagar"},{"id":1,"location":"Jacob Circle"},{"id":1,"location":"Jogeshwari"},{"id":1,"location":"Jogeshwari East"},{"id":1,"location":"Jogeshwari West"},{"id":1,"location":"Juhu Scheme"},{"id":1,"location":"Juhu Tara Road"},{"id":1,"location":"Kalachowki"},{"id":1,"location":"Kala Ghoda"},{"id":1,"location":"Kalamboli"},{"id":1,"location":"Kalbadevi"},{"id":1,"location":"Kalina"},{"id":1,"location":"Kalwa"},{"id":1,"location":"Kalwa West"},{"id":1,"location":"Kalyan"},{"id":1,"location":"Kalyan East"},{"id":1,"location":"Kalyan West"},{"id":1,"location":"Kamothe"},{"id":1,"location":"Kandivali"},{"id":1,"location":"Kanjur Marg East"},{"id":1,"location":"Kanjur Marg West"},{"id":1,"location":"Kanjurmarg"},{"id":1,"location":"Kanjurmarg East"},{"id":1,"location":"Kanjurmarg West"},{"id":1,"location":"Kazi Sayed Street"},{"id":1,"location":"Kemps Corner"},{"id":1,"location":"Khar"},{"id":1,"location":"Khar Danda"},{"id":1,"location":"Khar West"},{"id":1,"location":"Kharghar Sector 12"},{"id":1,"location":"Kharghar Sector 2"},{"id":1,"location":"Kharghar Sector 7"},{"id":1,"location":"Khetwadi"},{"id":1,"location":"Khopoli"},{"id":1,"location":"Kings Circle"},{"id":1,"location":"Kopar Khairane"},{"id":1,"location":"Koper Khraine"},{"id":1,"location":"Andheri Kurla Road"},{"id":1,"location":"Kurla East"},{"id":1,"location":"Kurla West"},{"id":1,"location":"Lal Bahadur Shastri Marg"},{"id":1,"location":"Lal Baug"},{"id":1,"location":"Lalbaug"},{"id":1,"location":"Lamington Road"},{"id":1,"location":"LBS Marg"},{"id":1,"location":"Link Road"},{"id":1,"location":"Lohar Chawl"},{"id":1,"location":"Lokhandwala"},{"id":1,"location":"Parel"},{"id":1,"location":"Lower Parel East"},{"id":1,"location":"Lower Parel West"},{"id":1,"location":"M G Road"},{"id":1,"location":"Mahakali Caves Road"},{"id":1,"location":"Mahalaxmi"},{"id":1,"location":"Mahalaxmi West"},{"id":1,"location":"Mahape"},{"id":1,"location":"Mahim"},{"id":1,"location":"Mahim East"},{"id":1,"location":"Mahim West"},{"id":1,"location":"Malabar Hill"},{"id":1,"location":"Aarey Milk Colony"},{"id":1,"location":"Airport"},{"id":1,"location":"Ambewadi"},{"id":1,"location":"Andheri"},{"id":1,"location":"Asvini"},{"id":1,"location":"Azad Nagar"},{"id":1,"location":"BPT Colony"},{"id":1,"location":"BN Bhavan"},{"id":1,"location":"Bandra"},{"id":1,"location":"Bazargate"},{"id":1,"location":"Bharat Nagar"},{"id":1,"location":"Bhavani Shankar Road"},{"id":1,"location":"CGS Colony"},{"id":1,"location":"Air India Staff Colony"},{"id":1,"location":"Century Mills Worli"},{"id":1,"location":"Chamar Baug"},{"id":1,"location":"Colaba"},{"id":1,"location":"Cotton Exchange"},{"id":1,"location":"Dadar Colony"},{"id":1,"location":"Dadar"},{"id":1,"location":"Danda"},{"id":1,"location":"Dockyard Road"},{"id":1,"location":"Dr Deshmukh Marg"},{"id":1,"location":"Falkland Road"},{"id":1,"location":"Girgaon Mdg"},{"id":1,"location":"Gokhale Road"},{"id":1,"location":"Goregoan"},{"id":1,"location":"Government Colony"},{"id":1,"location":"HMP School"},{"id":1,"location":"Haffkine Institute"},{"id":1,"location":"Haines Road"},{"id":1,"location":"Hanuman Road"},{"id":1,"location":"High Court Building"},{"id":1,"location":"Holiday Camp"},{"id":1,"location":"INS Hamla"},{"id":1,"location":"Central Building"},{"id":1,"location":"Parel Naka"},{"id":1,"location":"Oshiwara"},{"id":1,"location":"Opera House"},{"id":1,"location":"New Yogakshema"},{"id":1,"location":"New Prabhadevi Road"},{"id":1,"location":"N S Patkar Marg"},{"id":1,"location":"Mori Road"},{"id":1,"location":"Mazgaon Road"},{"id":1,"location":"JJ Hospital"},{"id":1,"location":"Juhu"},{"id":1,"location":"Kamathipura"},{"id":1,"location":"Ketkipada"},{"id":1,"location":"Kherwadi"},{"id":1,"location":"Kidwai Nagar"},{"id":1,"location":"Liberty Garden"},{"id":1,"location":"Mazagon Dock"},{"id":1,"location":"Naigaon"},{"id":1,"location":"Mumbai Central"},{"id":1,"location":"Orlem"},{"id":1,"location":"Nagardas Road"},{"id":1,"location":"Madhavbaug"},{"id":1,"location":"Khar Delivery"},{"id":1,"location":"MPT"},{"id":1,"location":"M A Marg"},{"id":1,"location":"Magathane"},{"id":1,"location":"LBSNE College"},{"id":1,"location":"Mazagaon"},{"id":1,"location":"Matunga Railway Workshop"},{"id":1,"location":"Motilal Nagar"},{"id":1,"location":"Nariman Point"},{"id":1,"location":"International Airport"},{"id":1,"location":"Irla"},{"id":1,"location":"Malad"},{"id":1,"location":"Mantralaya"},{"id":1,"location":"Marine Lines"},{"id":1,"location":"Marol Naka"},{"id":1,"location":"Prabhadevi"},{"id":1,"location":"Princess Dock"},{"id":1,"location":"Raj Bhavan"},{"id":1,"location":"Rajendra Nagar"},{"id":1,"location":"Ramwadi"},{"id":1,"location":"Ranade Road"},{"id":1,"location":"Rani Sati Marg"},{"id":1,"location":"SRPF Camp"},{"id":1,"location":"S Savarkar Marg"},{"id":1,"location":"S.K. Nagar"},{"id":1,"location":"Sahar PT Colony"},{"id":1,"location":"Sahargaon"},{"id":1,"location":"Santacruz Central"},{"id":1,"location":"Santacruz P AND T Colony"},{"id":1,"location":"Santacruz"},{"id":1,"location":"Secretariat"},{"id":1,"location":"SEEPZ"},{"id":1,"location":"Sewri"},{"id":1,"location":"Sharma Estate"},{"id":1,"location":"Shroffmahajan"},{"id":1,"location":"Shroff Mahajan"},{"id":1,"location":"Stock Exchange"},{"id":1,"location":"Tajmahal"},{"id":1,"location":"Tajmahal Hotel"},{"id":1,"location":"Tank Road"},{"id":1,"location":"Tardeo"},{"id":1,"location":"Taj Mahal Hotel"},{"id":1,"location":"Thakurdwar"},{"id":1,"location":"Town Hall"},{"id":1,"location":"Tulsiwadi"},{"id":1,"location":"VJB Udyan"},{"id":1,"location":"VK Bhavan"},{"id":1,"location":"VP Road"},{"id":1,"location":"VWTC"},{"id":1,"location":"Vakola"},{"id":1,"location":"Vesava"},{"id":1,"location":"Vidyanagari"},{"id":1,"location":"Vileeparle"},{"id":1,"location":"Vile Parle"},{"id":1,"location":"Wadala"},{"id":1,"location":"Worli"},{"id":1,"location":"Ambarnath West"},{"id":1,"location":"Kharghar"}];
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    $scope.model = "";
    $scope.getTestItems = function(query) { 
$scope.itemsArray = $scope.filterData(query);
              if (query) {
            return {
                items: $scope.itemsArray
            };
        }
        return {
            items: []
        };

         
    }
    $scope.clickedMethod = function (callback) {
    
    LSFactory.set('location', callback.selectedItems.location);
    $state.go('app.home');

}
          
    $scope.filterData = function(argument) {
         // body...  
         var found = $filter('filter')($scope.locationMaster, {location: argument}, false);
        return found;
    }
    
    $scope.gpsLocation = function() {
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
            var lat = position.coords.latitude;
            var longi = position.coords.longitude;
            var locationName;
            Loader.showLoading();
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + longi + '&sensor=false').then(function(response) {
                $scope.locationResult = response.data;
                angular.forEach($scope.locationResult.results[0].address_components, function(element, index) {
                    // statements
                    if(element.types[0] === "sublocality_level_1"){
                         locationName = element.long_name;
                    }
                });

                LSFactory.set('location', locationName);
                Loader.hideLoading();
                $state.go('app.home');
            })
        }, function(err) {
            // error
            alert('Make sure device location is enabled');
        });
    }
}]);
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
        name: 'Haldiram',
        image: 'shop2.jpg',
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
app.controller('ShopDetailCtrl', ['$scope', '$state', '$timeout', '$stateParams', 'LSFactory', '$rootScope', 'ShopService', 'Loader', '$ionicPopup', function($scope, $state, $timeout, $stateParams, LSFactory, $rootScope, ShopService, Loader, $ionicPopup) {
    Loader.showLoading();
    $timeout(function() {
        Loader.hideLoading();
    }, 2000);
    $scope.shopList = ShopService.getItems();
    $scope.selectedCat = 'Kaju Sweets';
    angular.forEach(LSFactory.get('Shops'), function(value, key) {
        if ($stateParams.shopId == value.id) {
            $scope.shop = value;
        }
    });
    $scope.addToCart = function(item, shop) {
        var itemInCart = LSFactory.get('cart') || [];
        if (!itemInCart.length) {
            LSFactory.setArray('cart', item);
            LSFactory.setArray('shop', shop);
        } else {
            var shopCheck = LSFactory.get('shop');
            if (shopCheck[0].id === shop.id) {
                var cart = LSFactory.get('cart');
                cart.push(item);
                LSFactory.set('cart', cart);
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Warning',
                    template: 'You can order from one shop at a time, if you add this item your previous cart will get clear.',

                })
                confirmPopup.then(function(res) {
                    if (res) {
                        LSFactory.delete('cart');
                        LSFactory.delete('shop');
                        LSFactory.setArray('cart', item);
                        LSFactory.setArray('shop', shop);
                        $rootScope.cartCount = (LSFactory.get('cart')).length;
                    }  
                });
            }
        }
        $rootScope.cartCount = (LSFactory.get('cart')).length;
    }
}]);
app.controller('CartCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', function($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout) {
    $scope.navTitle = LSFactory.get('location');
    $scope.cartItems = LSFactory.get('cart');
    $scope.shopFrom = LSFactory.get('shop');
    $scope.discount;
    $scope.deliveryChar;
    $rootScope.grandTotal;
    $scope.removeFromCart = function(index) {
        $scope.cartItems.splice(index, 1);
        LSFactory.set('cart', $scope.cartItems);
        $scope.cartItems = LSFactory.get('cart');
        $rootScope.cartCount = $scope.cartItems.length;
        if ($rootScope.cartCount < 1) {
            LSFactory.delete('cart');
            LSFactory.delete('shop');
        }
        calculateTotal();
    }
    $scope.updateCart = function() {
        LSFactory.set('cart', $scope.cartItems);
        calculateTotal();
    }
    var calculateTotal = function() {
        Loader.showLoading();
        $timeout(function() {
            $scope.subTotal = 0;
            angular.forEach($scope.cartItems, function(val, index) {
                $scope.subTotal += (val.price * val.qty);
            });
            Loader.hideLoading()
        $scope.discount = 100;
        $scope.deliveryChar = $scope.shopFrom[0].minOrder > $scope.subTotal ? $scope.shopFrom[0].deliveryCharge : 0;
        $rootScope.grandTotal = ($scope.subTotal + $scope.deliveryChar) - $scope.discount; 
        $scope.availFreeDelivery = $scope.shopFrom[0].minOrder - $scope.subTotal ;
        }, 600)

    }
    if($scope.cartItems){
    calculateTotal();
    }
    $scope.cartCheckout = function(cartObj, shopObj, subTotal, deliveryChar, grandTotal) {
     var tempObj =  {"shop": shopObj, "payment":{"subtotal":subTotal, "deliveryCharge":deliveryChar, "grandTotal":grandTotal}, "items":cartObj, "address":""};
      LSFactory.set('checkout',  tempObj ); 
    $state.go('app.delivery');
    }

}]);
app.controller('DeliveryCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', function($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout) {

    $scope.address = 'A'; 
      LSFactory.set("address", "504, Neelkanth Business Park, Vidyavihar West, Mumbai 440058");

}]);
app.controller('PaymentCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', '$ionicHistory', function($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout, $ionicHistory) {
     $ionicHistory.nextViewOptions({
        disableBack: true
    });
      var checkoutObj = LSFactory.get('checkout' ); 
      var date = new Date("October 13, 2014 11:13:00");
      console.log(date);
      var orderDetail = {"OrderId": Math.floor((Math.random() * 1000000) + 1), "orderDate": date, "Address":LSFactory.get('address')};
      if(checkoutObj){
      angular.extend(checkoutObj, orderDetail);
  }else {
      return false;
  }
      LSFactory.set('checkout',checkoutObj)
      var checkoutObj = LSFactory.get('checkout' ); 

      $scope.cartGrandTotal = checkoutObj.payment.grandTotal;
      $scope.confirmOrder = function () {
           /* body... */ 
           var checkoutObj = LSFactory.get('checkout');
           if(!LSFactory.get('orders')){ 
           LSFactory.setArray('orders', checkoutObj);

}
else{

            var tempOrderObj = LSFactory.get('orders');
            console.log(checkoutObj);
            console.log(tempOrderObj);
            tempOrderObj.push(checkoutObj);
            angular.extend(tempOrderObj, checkoutObj );
            LSFactory.set('orders', tempOrderObj);
            console.log(LSFactory.get('orders'));
}
            LSFactory.delete('checkout');
            LSFactory.delete('cart');
            LSFactory.delete('address');
            $rootScope.cartCount = 0;
            $scope.$apply;
            $state.go('app.order-confirmation');


      }
}]);

app.controller('OrdersCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', function($scope, $rootScope, $state, $stateParams, LSFactory) {
    $scope.orders =  LSFactory.get('orders');
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
 $scope.orders =  LSFactory.get('orders');
})

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleItem= function(item) {
    if ($scope.isItemShown(item)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = item;
    }
  };
  $scope.isItemShown = function(item) {
    return $scope.shownItem === item;
  };
 
    
}]);
