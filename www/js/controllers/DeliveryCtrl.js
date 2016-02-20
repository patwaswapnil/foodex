
app.controller('DeliveryCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'LSFactory', 'Loader', '$timeout', function($scope, $rootScope, $state, $stateParams, LSFactory, Loader, $timeout) {

    $scope.address = 'A'; 
      LSFactory.set("address", "504, Neelkanth Business Park, Vidyavihar West, Mumbai 440058");

}]);