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
                var chartData = [];

                angular.forEach($scope.voting.answers, function (answer) {
                    chartData.push([answer.title, (answer.votes && answer.votes.length) || 0]);
                });

                $scope.chartData = [chartData];
            };

            $scope.vote = function (answer) {
                Voting.vote({},
                    {
                        _id: $scope.voting._id,
                        _answerId: answer._id
                    });
            };

            $scope.chartOptions = {
                seriesDefaults: {
                    renderer: jQuery.jqplot.PieRenderer,
                    rendererOptions: {
                        showDataLabels: true
                    }
                },
                legend: {show: true, location: 's'}
            };

            $(window).on('resize', function () {
                //Force redraw on resize
                var chartData = $scope.chartData;
                delete $scope.chartData;
                $scope.$apply();
                $scope.chartData = chartData;
                $scope.$apply();
            });
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
