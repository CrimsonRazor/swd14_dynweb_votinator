'use strict';

angular.module('voting').directive('votingCreate', function() {
    return {
        templateUrl: "modules/voting/client/directives/create/voting.create.client.directive.html",
        controller: "VotingCreateController"
    }
});
