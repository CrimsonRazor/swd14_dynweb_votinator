'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    Voting = mongoose.model('Voting'),
    Answer = mongoose.model('Answer'),
    Recurring = mongoose.model('Recurring'),
    DynamicGenerationScript = mongoose.model('DynamicGenerationScript'),
    notificationService = require(path.resolve("./modules/voting/server/services/voting.server.recurring")),
    scriptRunnerService = require(path.resolve("./modules/voting/server/services/voting.server.scriptrunner")),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

function hash(o) {
    return crypto.createHash('sha256').update(o).digest("hex");
}

/**
 * Create a article
 */
exports.create = function (req, res) {
    var voting = new Voting(req.body);
    voting.user = req.user;

    var answers = voting.answers;
    for (var i = 0; i < answers.length; i++) {
        if (answers[i].dynamicGenerationScript) {
            //Security issue: Always explicitly set scripts to not approved
            answers[i].dynamicGenerationScript.adminApproved = false;
            answers[i].dynamicGenerationScript.hash = hash(answers[i].dynamicGenerationScript.script);
        }
    }

    voting.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(voting);
            if (voting.recurrence) {
                notificationService.recurringService(voting);
            }
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
 * Show the current script
 */
exports.readScript = function (req, res) {
    res.json(req.script);
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

function executeScriptsIfNecessary(answers, done) {
    var scriptsToRun = {};
    var generationScript;

    for (var i = 0; i < answers.length; i++) {
        generationScript = answers[i].dynamicGenerationScript;
        //When unapproved script found -> return
        if (generationScript) {
            if (!generationScript.adminApproved) {
                done();
            } else {
                scriptsToRun[generationScript._id] = generationScript.script;
            }
        }
    }

    scriptRunnerService.runScripts(scriptsToRun, function (err, scriptResults) {
        if (err) {
            done(err);
            return;
        }
        for (var i = 0; i < answers.length; i++) {
            generationScript = answers[i].dynamicGenerationScript;
            if (generationScript && scriptResults[generationScript._id]) {
                answers[i].title = scriptResults[generationScript._id];
            }
        }
        done();
    });
}

/**
 * Update a script
 */
exports.updateScript = function (req, res, next) {
    var voting = req.votingScript;
    var script = req.body;
    var scriptToUpdate;


    for (var i = 0; i < voting.answers.length; i++) {
        var dynScript = voting.answers[i].dynamicGenerationScript;
        if (dynScript && dynScript.id === req.scriptId) {
            scriptToUpdate = dynScript;
            break;
        }
    }

    script.hash = hash(script.script);

    var isNotAdmin = req.user.roles.indexOf('admin') === -1;

    //Only admins may change the approval
    if (isNotAdmin) {
        //Reset the approval if the script changes
        if (scriptToUpdate.hash !== script.hash) {
            scriptToUpdate.adminApproved = false;
        }
    } else {
        scriptToUpdate.adminApproved = script.adminApproved;
    }

    scriptToUpdate.hash = script.hash;
    scriptToUpdate.script = script.script;

    executeScriptsIfNecessary(voting.answers, function (err) {
        if (err) {
            return next(err);
        }
        voting.save(function (err) {
            if (err) {
                return next(err);
            } else {
                res.json(scriptToUpdate);
            }
        });
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
    list({
        $and: [
            {'end': {$gte: new Date()}},
            {
                'answers.dynamicGenerationScript.adminApproved': {$nin: [false]}
            }
        ]
    }, req, res);
};

exports.unapprovedScripts = function (req, res) {
    Voting.find({'answers.dynamicGenerationScript.adminApproved': false}, function (err, votings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.status(200).json(votings);
    });
};

/**
 * Voting function
 */
exports.vote = function (req, res) {
    Voting.findById(req.voting, function (err, voting) {
        if (voting.answerType === 'single') {
            voteSingle(voting, req, res);
        } else {
            voteMultiple(voting, req, res);
        }
    });
};

function voteSingle(voting, req, res) {
    var answerId = req.body._answerId[0];

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
}

function voteMultiple(voting, req, res) {
    var answerIds = req.body._answerId;

    if (answerIds.length > voting.maxAnswers) {
        return res.status(400).send({
            message: 'Too many answers for this voting'
        });
    }

    var foundAnswers = voting.answers.filter(function (answer) {
        return answerIds.indexOf(answer._id.toString()) !== -1;
    });

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
                foundAnswers.forEach(function (answer) {
                    answer.votes.push(req.user.id);
                });
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
}

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

exports.scriptByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Script is invalid'
        });
    }

    Voting.find({'answers.dynamicGenerationScript._id': id}).exec(function (err, voting) {
        if (err) {
            return next(err);
        } else if (!voting) {
            return res.status(404).send({
                message: 'No script with that identifier has been found'
            });
        }

        req.votingScript = voting[0];
        req.scriptId = id;
        next();
    });
};
