'use strict';

/**
 * Module dependencies.
 */
var votingPolicy = require('../policies/voting.server.policy'),
    voting = require('../controllers/voting.server.controller');

module.exports = function (app) {
    //Script approval
    app.route('/api/votings/scripts')
        .all(votingPolicy.isAllowed)
        .get(voting.unapprovedScripts);

    app.route('/api/votings/scripts/:scriptId')
        .all(votingPolicy.isAllowed)
        .get(voting.readScript)
        .put(voting.updateScript);

    // Voting collection routes
    app.route('/api/votings')
        .all(votingPolicy.isAllowed)
        .get(voting.userList)
        .post(voting.create);

    app.route('/api/votings/open')
        .all(votingPolicy.isAllowed)
        .get(voting.openList);

    app.route('/api/votings/closed')
        .all(votingPolicy.isAllowed)
        .get(voting.closedUserList);

    // Single voting routes
    app.route('/api/votings/:votingId')
        .all(votingPolicy.isAllowed)
        .get(voting.read)
        .put(voting.update)
        .delete(voting.delete);

    // Vote route
    app.route('/api/votings/:votingId/vote')
        .all(votingPolicy.isAllowed)
        .post(voting.vote);

    app.route('/api/votings/:votingId/unvote')
        .all(votingPolicy.isAllowed)
        .get(voting.unvote);
    //.put(voting.updateVote)
    //.delete(voting.deleteVote);

    // Finish by binding the variables middleware
    app.param('votingId', voting.votingByID);
    app.param('scriptId', voting.scriptByID);
};
