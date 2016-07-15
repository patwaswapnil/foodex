app.controller('HomeCtrl', ['$scope', '$state', '$timeout', 'Loader', 'LSFactory', '$ionicHistory', '$ionicPopover', 'APIFactory',
 function($scope, $state, $timeout, Loader, LSFactory, $ionicHistory, $ionicPopover, APIFactory) { 
    var axis
    $scope.navTitle = LSFactory.get('location');
    axis = LSFactory.get('axis') || {lat:'', long:''};
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) { 
    axis = LSFactory.get('axis') || {lat:'', long:''}; 
 if(fromState.name == "app.location"){ 
         $scope.navTitle = LSFactory.get('location'); 
         var data = {location: $scope.navTitle};
         $scope.getShops(data);
 } 
 if(!$scope.navTitle || !axis.lat || !axis.long){
        Loader.toast('No shops found. Please select another location');
        $state.go('app.location');
 }
}); 
    //shop API
    $scope.getShops = function (data) { 
    Loader.show();
    APIFactory.getShops(data).then(function (response) { 
    $scope.shops = response.data.data;
    Loader.hide();
    $scope.$digest;
    }, function (error) {
      console.error(error);
         Loader.hide();
         Loader.toast('Oops! something went wrong. Please select another location');
        $state.go('app.location');
    
    })
    };
    //get shop listing
    var data = {location: $scope.navTitle};
    $scope.getShops(data);
    //for filters
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });
}]);