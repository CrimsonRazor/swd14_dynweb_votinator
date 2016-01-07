'use strict';

angular.module('voting').factory('Voting', ['$resource',
    function ($resource) {
        return $resource('api/votings/:votingId', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
