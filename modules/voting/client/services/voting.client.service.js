'use strict';

angular.module('voting').factory('Voting', ['$resource',
    function ($resource) {
        return $resource('api/votings/:votingId', {
            votingId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE',
                url: 'api/votings/:votingId',
                param: {
                    votingId: '@_id'
                }
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
            },
            unapprovedScripts: {
                url: '/api/votings/scripts',
                method: 'GET',
                isArray: true
            },
            updateScript: {
                url: '/api/votings/scripts/:scriptId',
                param: {
                    scriptId: '@scriptId'
                },
                method: 'PUT'
            }
        });
    }
]);
