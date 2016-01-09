'use strict';

angular.module('voting')
    .controller('VotingDashboardController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
        function ($scope, $stateParams, $location, Authentication, Voting) {
            $scope.authentication = Authentication;

            $scope.selectVoting = function (voting) {
                $scope.votings.forEach(function (v) {
                    v.selected = false;
                });

                voting.selected = true;
            };

            $scope.find = function () {
                $scope.votings = Voting.query(function () {
                    $scope.votings[0].selected = true; // always select the first voting
                });
            };

            $scope.findOne = function () {
                $scope.voting = Voting.get({
                    votingId: $stateParams.votingId
                });
            };
        }
    ])
    .controller('VotingDashboardOpenVotingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
        function ($scope, $stateParams, $location, Authentication, Voting) {
            $scope.authentication = Authentication;

            $scope.votings = Voting.query(function (votings) {
                if (votings.length) {
                    votings[0].selected = true; // always select the first voting
                }
            });

            $scope.selectVoting = function (voting) {
                $scope.voting = voting;
            };

            $scope.vote = function (answer) {
                Voting.vote({},
                    {
                        _id: $scope.voting._id,
                        _answerId: answer._id
                    });
            }
        }
    ])
    .controller('VotingDashboardClosedVotingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
        function ($scope, $stateParams, $location, Authentication, Voting) {
            $scope.authentication = Authentication;

            $scope.selectVoting = function (voting) {
                $scope.votings.forEach(function (v) {
                    v.selected = false;
                });

                voting.selected = true;
            };

            $scope.find = function () {
                $scope.votings = Voting.query(function () {
                    $scope.votings[0].selected = true; // always select the first voting
                });
            };

            $scope.findOne = function () {
                $scope.voting = Voting.get({
                    votingId: $stateParams.votingId
                });
            };
        }
    ])
    .controller('VotingDashboardMyVotingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
        function ($scope, $stateParams, $location, Authentication, Voting) {
            $scope.authentication = Authentication;

            $scope.selectVoting = function (voting) {
                $scope.votings.forEach(function (v) {
                    v.selected = false;
                });

                voting.selected = true;
            };

            $scope.findMyVotings = function () {
                $scope.votings = Voting.query(function () {
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
