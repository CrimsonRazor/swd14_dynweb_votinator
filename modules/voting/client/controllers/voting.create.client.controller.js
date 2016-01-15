'use strict';

angular.module('voting').controller('VotingCreateController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
    function ($scope, $stateParams, $location, Authentication, Voting) {
        $scope.authentication = Authentication;

        initValues();

        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'votingForm');

                return false;
            }

            var voting = new Voting({
                title: this.title,
                answers: this.answers,
                answerType: this.answerType,
                votingType: this.votingType,
                maxAnswers: this.maxAnswers,
                start: this.start,
                end: this.end,
                recurrence: this.recurrence
            });

            voting.$save(function (response) {
                $location.path('voting/' + response._id);

                initValues();

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.addAnswer = function (answer) {
            $scope.answers.push(answer);
            $scope.answer = {};
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
            $scope.recurrence.hourOfDay = $scope.reccurrenceTime.getHours();
            $scope.recurrence.minute = $scope.reccurrenceTime.getMinutes();
        };

        function initValues() {
            $scope.title = "";
            $scope.answers = [];
            $scope.answerType = 'single';
            $scope.votingType = 'once-only';
            $scope.maxAnswers = 0;
            $scope.start = Date.now();
            $scope.end = Date.now() + 7;
            $scope.recurrence = {
                "weekDays": [false, false, false, false, false, false, false],
                "hourOfDay": 0,
                "minute": 0
            };
            $scope.answer = {};
            $scope.reccurrenceTime = new Date();
        }
    }
]);
