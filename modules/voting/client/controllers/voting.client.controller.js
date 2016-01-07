'use strict';

angular.module('voting').controller('VotingController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
    function ($scope, $stateParams, $location, Authentication, Voting) {
        $scope.authentication = Authentication;

        $scope.remove = function (voting) {
            if (voting) {
                voting.$remove();

                for (var i in $scope.votings) {
                    if ($scope.votings[i] === voting) {
                        $scope.votings.splice(i, 1);
                    }
                }
            } else {
                $scope.voting.$remove(function () {
                    $location.path('voting');
                });
            }
        };

        $scope.update = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'votingForm');

                return false;
            }

            var voting = $scope.voting;

            voting.$update(function () {
                $location.path('voting/' + voting._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function () {
            $scope.votings = Voting.query();
        };

        $scope.findOne = function () {
            $scope.voting = Voting.get({
                votingId: $stateParams.votingId
            });
        };
    }
]);
