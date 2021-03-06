'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Voting Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/votings',
            permissions: '*'
        }, {
            resources: '/api/votings/open',
            permissions: '*'
        }, {
            resources: '/api/votings/closed',
            permissions: '*'
        }, {
            resources: '/api/votings/:votingId',
            permissions: '*'
        }, {
            resources: '/api/votings/:votingId/vote',
            permissions: '*'
        }, {
            resources: '/api/votings/scripts',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/votings',
            permissions: ['get', 'post']
        }, {
            resources: '/api/votings/open',
            permissions: ['get']
        }, {
            resources: '/api/votings/closed',
            permissions: ['get']
        }, {
            resources: '/api/votings/:votingId',
            permissions: ['get']
        }, {
            resources: '/api/votings/:votingId/vote',
            permissions: ['post']
        }, {
            resources: '/api/votings/scripts/:scriptId',
            permissions: ['get', 'put']
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/votings/open',
            permissions: ['get']
        }, {
            resources: '/api/votings/:votingId',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Voting Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If a voting is being processed and the current user created it then allow any manipulation
    if (req.voting && req.user && req.voting.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // An authorization error occurred.
            return res.status(500).send('Unexpected authorization error');
        } else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                return next();
            } else {
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
