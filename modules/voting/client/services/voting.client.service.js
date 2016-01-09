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
            }
        });
    }
]);
