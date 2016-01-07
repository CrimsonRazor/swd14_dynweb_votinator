'use strict';

angular.module('voting').controller('VotingCreateController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
    function ($scope, $stateParams, $location, Authentication, Voting) {
        $scope.authentication = Authentication;

        $scope.title = "";
        $scope.options = [];

        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'votingForm');

                return false;
            }

            var voting = new Voting({
                title: this.title,
                content: this.content
            });

            voting.$save(function (response) {
                $location.path('voting/' + response._id);

                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.addOption = function(option) {
            $scope.options.push(option);
            $scope.option = "";
        };

        $scope.removeOption = function(option) {
            var optionIndex = $scope.options.indexOf(option);
            if (optionIndex !== -1) {
                $scope.options.splice(optionIndex, 1);
            }
        }
    }
]);
