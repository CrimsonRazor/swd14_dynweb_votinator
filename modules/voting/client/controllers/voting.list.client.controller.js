'use strict';

angular.module('voting').controller('VotingListController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
    function ($scope, $stateParams, $location, Authentication, Voting) {
        $scope.authentication = Authentication;

        $scope.selectVoting = function(voting) {
            $scope.votings.forEach(function(v) {
                v.selected = false;
            });

            voting.selected = true;
        };

        $scope.find = function () {
            $scope.votings = Voting.query(function() {
                $scope.votings[0].selected = true; // always select the first voting
            });
        };

        $scope.findOne = function () {
            $scope.voting = Voting.get({
                votingId: $stateParams.votingId
            });
        };
    }
]);
