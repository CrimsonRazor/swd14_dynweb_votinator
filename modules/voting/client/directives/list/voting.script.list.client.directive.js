'use strict';

angular.module('voting').directive('votingScriptList', function() {
    return {
        templateUrl: "modules/voting/client/directives/list/voting.script.list.client.directive.html",
        controller: "VotingScriptController"
    }
});
