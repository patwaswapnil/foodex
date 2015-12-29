var app = angular.module('foodex.controllers', [])

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup) {

    $scope.showLogin = true;
    $scope.directClose = false; //if register button direct clicked
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
        scope: $scope
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

});
app.controller('LocationCtrl', function($scope ) {
     

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

});
app.controller('HomeCtrl', function($scope, $ionicSlideBoxDelegate ) {
 
});