'use strict';

angular.module('voting')
    .directive('votingDashboard', function () {
        return {
            templateUrl: "modules/voting/client/directives/dashboard/voting.dashboard.client.directive.html",
            controller: "VotingDashboardController"
        };
    })
    .directive('openVotings', function () {
        return {
            templateUrl: "modules/voting/client/directives/dashboard/voting.dashboard.basicwidget.client.directive.html",
            scope: {
                isCollapsed: '=isCollapsed'
            },
            controller: "VotingDashboardOpenVotingsController"
        };
    })
    .directive('closedVotings', function () {
        return {
            templateUrl: "modules/voting/client/directives/dashboard/voting.dashboard.basicwidget.client.directive.html",
            scope: {
                isCollapsed: '=isCollapsed'
            },
            controller: "VotingDashboardClosedVotingsController"
        };
    })
    .directive('myVotings', function () {
        return {
            templateUrl: "modules/voting/client/directives/dashboard/voting.dashboard.basicwidget.client.directive.html",
            scope: {
                isCollapsed: '=isCollapsed'
            },
            controller: "VotingDashboardMyVotingsController"
        };
    });
