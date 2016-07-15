app.controller('LocationCtrl', ['$scope', '$state', '$cordovaGeolocation', '$http', '$ionicHistory', 'LSFactory', '$filter', 'Loader', 'APIFactory', 
    function($scope, $state, $cordovaGeolocation, $http, $ionicHistory, LSFactory, $filter, Loader, APIFactory) {
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
        $scope.clickedMethod = function(callback) {
            if(callback.selectedItems.value == 'No Data Found'){
                return false;
            } 
            LSFactory.set('location', callback.selectedItems.value);
            LSFactory.set('axis', {lat: callback.selectedItems.latitude,long: callback.selectedItems.longitude});
            $state.go('app.home');
        
        }
        $scope.filterData = function(location) {
            APIFactory.searchLocation(location).then(function(response) {
                $scope.found = response.data;
            }, function(error) {
                $scope.found = [];
            });
            return $scope.found;
        }
        
        $scope.gpsLocation = function() {
            Loader.show();
            var posOptions = {
                timeout: 7000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
                var lat = position.coords.latitude;
                var longi = position.coords.longitude; 
                LSFactory.set('axis', {lat: lat,long: longi});
                var locationName;
                $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + longi + '&sensor=false').then(function(response) {
                    $scope.locationResult = response.data;
                    // angular.forEach($scope.locationResult.results[0].address_components, function(element, index) {
                    //     // statements
                    //     if (element.types[0] === "sublocality_level_1") {
                    //         locationName = element.long_name;
                    //     }
                    // });
                    console.log($scope.locationResult.results[5].address_components[1].long_name)
                    locationName = $scope.locationResult.results[5].address_components[1].long_name;
                    LSFactory.set('location', locationName);
                    Loader.hide();
                    $state.go('app.home');
                })
            }, function(err) {
                // error
                Loader.hide(); 
                function onRequestSuccess(success) {
                    $scope.gpsLocation();
                }
                  function onRequestFailure(error) { 
                        if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                            alert(window.confirm("Failed to automatically set Location. You can switch to the Location Settings page and do this manually and try again"))
                                
                        }
                        else {
                                Loader.toast('Please enable your device location');
                        }

                    }
                
                cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY);
            });
        
        
        }
    }]);
