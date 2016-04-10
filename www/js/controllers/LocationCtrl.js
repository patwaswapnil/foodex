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
    $scope.clickedMethod = function (callback) { 
    LSFactory.set('location', callback.selectedItems.value);
    LSFactory.set('axis', {lat:callback.selectedItems.latitude, long:callback.selectedItems.longitude});
    $state.go('app.home');

}
    $scope.filterData = function(location) { 
        APIFactory.searchLocation(location).then(function (response) {
             $scope.found =  response.data; 
        }, function (error) { 
             $scope.found  = [];
        }); 
        return $scope.found;
    }
    
    $scope.gpsLocation = function() {
            Loader.show();
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
            var lat = position.coords.latitude;
            var longi = position.coords.longitude;
            LSFactory.set('axis', {lat:lat, long:longi});
            var locationName;
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + longi + '&sensor=false').then(function(response) {
                $scope.locationResult = response.data;
                angular.forEach($scope.locationResult.results[0].address_components, function(element, index) {
                    // statements
                    if(element.types[0] === "sublocality_level_1"){
                         locationName = element.long_name;
                    }
                });

                LSFactory.set('location', locationName);
                Loader.hide();
                $state.go('app.home');
            })
        }, function(err) {
            // error
                Loader.hide();
            alert('Make sure device location is enabled');
        });
    }
}]);