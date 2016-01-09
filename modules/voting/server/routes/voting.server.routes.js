'use strict';

/**
 * Module dependencies.
 */
var votingPolicy = require('../policies/voting.server.policy'),
    voting = require('../controllers/voting.server.controller');

module.exports = function (app) {
    // Voting collection routes
    app.route('/api/votings')
        .all(votingPolicy.isAllowed)
        .get(voting.list)
        .post(voting.create);

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
        //.put(voting.updateVote)
        //.delete(voting.deleteVote);

    // Finish by binding the voting middleware
    app.param('votingId', voting.votingByID);
};
