'use strict';

var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var Voting = mongoose.model('Voting');
var Recurring = mongoose.model('Recurring');
var errorHandler = require('../../../core/server/controllers/errors.server.controller');
var chalk = require('chalk');

var RecurringService = function (voting) {
    var hour = voting.recurrence.hour;
    var minute = voting.recurrence.minute;
    var weekDays = voting.recurrence.weekDays;
    var weekDaysString = filterWeekDays(weekDays).join(",");
    var cronString = createCronString(0, minute, hour, weekDaysString);

    new CronJob(cronString, function () {
        Voting.findOne({_id: voting._id}, function (err, voting) {
            //Old voting must be closed here
            voting.end = Date.now();
            voting.save();

            //Create new document by templating the old one
            var newVoting = voting.toObject();

            resetIds(newVoting);
            resetAnswerVotes(newVoting.answers);

            newVoting.start = Date.now();
            newVoting.end = addDays(new Date(), nextDayInWeekDays(weekDays)).getTime();
            new Voting(newVoting).save(function (err) {
                if (err) {
                    var message = errorHandler.getErrorMessage(err);
                    console.log(chalk.red("Error while creating recurring voting for '" + voting._id + "': " + message));
                }
            });
        });
    }, null, true);
};

function nextDayInWeekDays(weekDays) {
    var weekDay = new Date().getDate() % 7;
    var slice = weekDays.slice(weekDay + 1, weekDay + (weekDays.length - weekDay));
    for (var i = 0; i < slice.length; i++) {
        if (slice[i]) return i;
    }
}

function createCronString(second, minute, hour, weekDays) {
    return second + " " + minute + " " + hour + " * * " + weekDays;
}

function filterWeekDays(weekDays) {
    return [0, 1, 2, 3, 4, 5, 6].filter(function (wd) {
        return weekDays[wd];
    }).map(function (v) {
        return (v + 1) % 7;
    });

}

function addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}

function resetIds(o) {
    delete o._id;
    for (var key in o) {
        resetIds(o[key]);
    }
}

function resetAnswerVotes(answers) {
    for (var answer in answers) {
        if (answers[answer].votes) {
            answers[answer].votes = [];
        }
    }
}

exports.recurringService = RecurringService;
