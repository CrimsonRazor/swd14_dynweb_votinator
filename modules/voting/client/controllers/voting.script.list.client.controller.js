'use strict';

angular.module('voting')
    .controller('VotingScriptController', ['$scope', '$stateParams', '$location', 'Authentication', 'Voting',
        function ($scope, $stateParams, $location, Authentication, Voting) {
            $scope.authentication = Authentication;

            $scope.find = function () {
                delete $scope.error;
                Voting.unapprovedScripts().$promise.then(function (result) {
                    $scope.votings = result;
                });
            };

            $scope.find();

            $scope.selectAnswer = function (answer) {
                delete $scope.error;
                $scope.selectedAnswer = answer;
            };

            $scope.updateScript = function (approve) {
                delete $scope.error;
                if (approve) {
                    $scope.selectedAnswer.dynamicGenerationScript.adminApproved = !!approve;
                }

                var scriptId = $scope.selectedAnswer.dynamicGenerationScript._id;
                delete $scope.selectedAnswer.dynamicGenerationScript._id;
                Voting.updateScript({
                    scriptId: scriptId
                }, $scope.selectedAnswer.dynamicGenerationScript).$promise
                    .then(function () {
                        $scope.find();
                        delete $scope.selectedAnswer;
                    }, function () {
                        $scope.error = true;
                    });
            };
        }
    ])
    .controller('VotingStateController', ['$scope', 'Authentication', function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }]);
