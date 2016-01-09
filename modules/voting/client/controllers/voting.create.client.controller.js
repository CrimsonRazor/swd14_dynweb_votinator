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
                start: this.start,
                end: this.end
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

        $scope.removeOption = function (answer) {
            var answerIndex = $scope.answers.indexOf(answer);
            if (answerIndex !== -1) {
                $scope.answers.splice(answerIndex, 1);
            }
        };

        function initValues() {
            $scope.title = "";
            $scope.answers = [];
            $scope.answerType = 'single';
            $scope.votingType = 'once-only';
            $scope.start = Date.now();
            $scope.end = Date.now() + 7;
            $scope.answer = {};
        }
    }
]);
