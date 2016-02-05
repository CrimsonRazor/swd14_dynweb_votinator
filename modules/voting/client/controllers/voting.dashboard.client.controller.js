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
            dashboardWidgetTemplate($scope, 'Open Votings', Authentication, Voting.open);
            votingTemplate($scope, $location, Voting);
        }
    ])
    .controller('VotingDashboardClosedVotingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
        function ($scope, $stateParams, $location, Authentication, Voting) {
            dashboardWidgetTemplate($scope, 'My Closed Votings', Authentication, Voting.closedUser);
        }
    ])
    .controller('VotingDashboardMyVotingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
        function ($scope, $stateParams, $location, Authentication, Voting) {
            dashboardWidgetTemplate($scope, 'My Votings', Authentication, Voting.query);
            votingTemplate($scope, $location, Voting);

            $scope.showCreateLink = true;
        }
    ]);

function votingTemplate($scope, $location, Voting) {
    $scope.answers = {};
    $scope.vote = function (answers) {
        var answerIds = parseAnswers(answers);
        Voting.vote({},
            {
                _id: $scope.voting._id,
                _answerId: answerIds
            }).$promise.then(function () {
            $scope.refresh && $scope.refresh();
        });
        $scope.voting.hasVoted = true;
    };

    $scope.unvote = function () {
        Voting.unvote({},
            {
                _id: $scope.voting._id
            }).$promise.then(function () {
            $scope.voting.hasVoted = false;
            $scope.refresh && $scope.refresh();
        });
    };

    $scope.editVoting = function (voting) {
        $location.path("voting/" + voting._id + "/edit").replace();
    };

    $scope.deleteVoting = function (voting) {
        var index = $scope.votings.indexOf(voting);
        Voting.delete({},
            {
                _id: voting._id
            }).$promise.then(function () {
            $scope.votings.splice(index, 1);
            $scope.refresh && $scope.refresh();
        });
    };
}

function parseAnswers(answers) {
    var answerIds = [];
    if (answers.hasOwnProperty("_id")) {
        answerIds.push(answers._id);
    } else {
        for (var answer in answers) {
            if (answers[answer]) {
                answerIds.push(answer);
            }
        }
    }

    return answerIds;
}

function dashboardWidgetTemplate($scope, title, Authentication, votingResource) {
    $scope.title = title;
    $scope.authentication = Authentication;

    var load = function () {
        votingResource().$promise.then(function (votings) {
            $scope.votings = votings;
            $scope.votings.forEach(function (voting) {
                var userId = Authentication.user._id;
                if (userId === voting.user._id) {
                    voting.canDelete = true;
                    voting.canEdit = true;
                }
                voting.answers.forEach(function (answer) {
                    if (answer.votes.indexOf(userId) !== -1) {
                        voting.hasVoted = true;
                    }
                });

                if ($scope.voting && $scope.voting._id === voting._id) {
                    $scope.voting = voting;
                }
            });

            if ($scope.voting) {
                $scope.selectVoting($scope.voting);
            }
        });
    };

    load();
    $scope.refresh = load;

    $scope.selectVoting = function (voting) {
        $scope.chartDataShown = true;
        $scope.voting = voting;
        var chartData = [];

        angular.forEach($scope.voting.answers, function (answer) {
            chartData.push([answer.title, (answer.votes && answer.votes.length) || 0]);
        });

        $scope.chartData = [chartData];
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
