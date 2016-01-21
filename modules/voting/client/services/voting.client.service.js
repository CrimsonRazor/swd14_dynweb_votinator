'use strict';

angular.module('voting').factory('Voting', ['$resource',
    function ($resource) {
        return $resource('api/votings/:votingId', {
            votingId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            vote: {
                method: 'POST',
                url: 'api/votings/:votingId/vote',
                param: {
                    votingId: '@_id'
                }
            },
            closedUser: {
                url: 'api/votings/closed',
                method: 'GET',
                isArray: true
            },
            open: {
                url: 'api/votings/open',
                method: 'GET',
                isArray: true
            }
        });
    }
]);
