'use strict';

angular.module('users').controller('ActivationController', ['$scope', '$state', '$stateParams', '$http', 'Authentication',
    function ($scope, $state, $stateParams, $http, Authentication) {
        $scope.success = false;
        $http.get('/api/auth/activate/' + $stateParams.token).success(function(response) {
            $scope.success = true;
            Authentication.user = response;
            $state.go('home', $state.previous.params);
        });
    }
]);
