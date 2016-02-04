'use strict';

angular.module('voting').controller('VotingEditController', ['$scope', '$state', '$stateParams', 'Authentication', 'Voting',
    function ($scope, $state, $stateParams, Authentication, Voting) {
        $scope.authentication = Authentication;
        var votingId = $stateParams.votingId;

        initValues(votingId);

        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'votingForm');

                return false;
            }

            Voting.update({}, {
                _id: this.votingId,
                title: this.title,
                answers: this.answers,
                answerType: this.answerType,
                votingType: this.votingType,
                maxAnswers: this.maxAnswers,
                start: this.start,
                end: this.end,
                recurrence: this.recurrence
            }).$promise.then(function() {
                $state.go('home');
            });
        };

        $scope.addAnswer = function (answer) {
            delete answer.dynamicGenerationScript;
            $scope.answers.push(answer);
            $scope.answer = {dynamicGenerationScript: {}};
        };

        $scope.addScriptAnswer = function (answer) {
            delete answer.title;
            $scope.answers.push(answer);
            $scope.answer = {dynamicGenerationScript: {}};
        };

        $scope.removeAnswer = function (answer) {
            var answerIndex = $scope.answers.indexOf(answer);
            if (answerIndex !== -1) {
                if ($scope.maxAnswers === $scope.answers.length) {
                    $scope.maxAnswers--;
                }
                $scope.answers.splice(answerIndex, 1);
            }
        };

        $scope.changeVotingType = function (votingType) {
            $scope.votingType = votingType;
        };

        $scope.changeAnswerType = function (answerType) {
            $scope.answerType = answerType;
        };

        $scope.timeChanged = function () {
            $scope.recurrence.hour = $scope.reccurrenceTime.getHours();
            $scope.recurrence.minute = $scope.reccurrenceTime.getMinutes();
        };

        function initValues(votingId) {
            $scope.votingId = votingId;

            Voting.get({}, {
                    _id: votingId
                }).$promise.then(function(voting)  {
                    console.log(voting);
                    $scope.title = voting.title;
                    $scope.answers = voting.answers;
                    $scope.answerType = voting.answerType;
                    $scope.votingType = voting.votingType;
                    $scope.maxAnswers = voting.maxAnswers;
                    $scope.start = new Date();
                    $scope.end = addDays(new Date(), 7).getTime();
                    $scope.recurrence = voting.recurrence;
                    var hour = voting.recurrence.hour;
                    var minute = voting.recurrence.minute;
                    $scope.reccurrenceTime = new Date(hour, minute, 0);
            });
        }

        function addDays(date, days) {
            date.setDate(date.getDate() + days);
            return date;
        }
    }
]);
