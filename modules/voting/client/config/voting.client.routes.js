'use strict';

angular.module('voting').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('voting', {
                abstract: true,
                url: '/voting',
                template: '<ui-view/>'
            })
            //.state('voting.list', {
            //    url: '',
            //    controller: 'VotingListController',
            //    templateUrl: 'modules/voting/client/views/list-votings.client.view.html',
            //    data: {
            //        roles: ['user', 'admin']
            //    }
            //})
            .state('voting.create', {
                url: '/create',
                controller: 'VotingCreateController',
                templateUrl: 'modules/voting/client/views/create-voting.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('voting.view', {
                url: '/:votingId',
                controller: 'VotingController',
                templateUrl: 'modules/voting/client/views/view-voting.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('voting.edit', {
                url: '/:votingId/edit',
                controller: 'VotingController',
                templateUrl: 'modules/voting/client/views/edit-voting.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('voting.scripts', {
                url: '/scripts',
                controller: 'VotingStateController',
                templateUrl: 'modules/voting/client/views/list-voting-scripts.client.view.html',
                data: {
                    ignoreState: true,
                    roles: ['admin']
                }
            });
    }
]);
