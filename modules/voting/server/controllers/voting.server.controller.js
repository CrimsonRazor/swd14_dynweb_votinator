'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Voting = mongoose.model('Voting'),
    Answer = mongoose.model('Answer'),
    Recurring = mongoose.model('Recurring'),
    notificationService = require(path.resolve("./modules/voting/server/services/voting.server.recurring")),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function (req, res) {
    var voting = new Voting(req.body);
    voting.user = req.user;

    voting.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(voting);
            notificationService.recurringService(voting);
        }
    });
};

/**
 * Show the current voting
 */
exports.read = function (req, res) {
    res.json(req.voting);
};

/**
 * Update a voting
 */
exports.update = function (req, res) {
    var voting = req.voting;

    //TODO
    //article.title = req.body.title;
    //article.content = req.body.content;

    voting.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(voting);
        }
    });
};

/**
 * Delete a voting
 */
exports.delete = function (req, res) {
    var voting = req.voting;

    voting.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(voting);
        }
    });
};

/**
 * List of votings
 */
function list(filter, req, res) {
    Voting.find(filter).sort('-created').populate('user', 'displayName').exec(function (err, votings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(votings);
        }
    });
}

exports.userList = function (req, res) {
    if (!req.user || !req.user.id) {
        res.status(401).send("You are not authorized to request this resource!");
        return;
    }

    list({'user': req.user.id, 'end': {$gt: Date.now()}}, req, res);
};

exports.closedUserList = function (req, res) {
    if (!req.user || !req.user.id) {
        res.status(401).send("You are not authorized to request this resource!");
        return;
    }

    list({'user': req.user.id, 'end': {$lte: Date.now()}}, req, res);
};

exports.openList = function (req, res) {
    list({'end': {$gt: Date.now()}}, req, res);
};

/**
 * Voting function
 */
exports.vote = function (req, res) {
    var voting = req.voting;
    var answerId = req.body._answerId;

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
        return res.status(400).send({
            message: 'Answer id is invalid'
        });
    }

    var foundAnswer;

    voting.answers.forEach(function (answer) {
        if (answer._id == answerId) {
            foundAnswer = answer;
        }
    });

    if (!foundAnswer) {
        res.status(400).send({
            message: 'No answer with the given id found for this voting.'
        });
        return;
    }

    Voting.count({_id: voting._id, 'answers.votes': req.user.id}, function (err, count) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (count != 0) {
                res.status(400).send({
                    message: 'You already voted! Please remove your vote first.'
                });
            } else {
                foundAnswer.votes.push(req.user.id);
                voting.save(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.status(200).send();
                    }
                });
            }
        }

    });
};

/**
 * Voting middleware
 */
exports.votingByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Voting is invalid'
        });
    }

    Voting.findById(id).populate('user', 'title').exec(function (err, voting) {
        if (err) {
            return next(err);
        } else if (!voting) {
            return res.status(404).send({
                message: 'No voting with that identifier has been found'
            });
        }
        req.voting = voting;
        next();
    });
};

exports.answerByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Answer is invalid'
        });
    }

    Answer.findById(id).populate('votes', 'title').exec(function (err, answer) {
        if (err) {
            return next(err);
        } else if (!answer) {
            return res.status(404).send({
                message: 'No answer with that identifier has been found'
            });
        }
        req.answer = answer;
        next();
    });
};
