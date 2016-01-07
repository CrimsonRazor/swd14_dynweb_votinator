'use strict';

angular.module('voting').directive('votingList', function() {
    return {
        templateUrl: "modules/voting/client/directives/list/voting.list.client.directive.html",
        controller: "VotingListController"
    }
});
