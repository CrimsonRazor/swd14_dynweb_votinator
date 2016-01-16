'use strict';

var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var Voting = mongoose.model('Voting');
var Recurring = mongoose.model('Recurring');

// TODO refactor this shit as fuck
var NotificationService = function(voting) {
    var hour = voting.recurrence.hourOfDay;
    var minute = voting.recurrence.minute;
    var weekDays = [1, 2, 3, 4, 5, 6, 7].filter(function(wd) {
        return voting.recurrence.weekDays[wd - 1];
    }).join(",");
    var cronString = "0 " + minute + " " + hour + " * * " + weekDays;
    new CronJob(cronString, function() {
        Voting.findOne({title: voting.title}, function(err, voting) {
            voting.start = Date.now();
            voting.end = Date.now() + 7; // sucks, should find the next occuring date
            voting.save();
        });
    }, null, true);
};

exports.notificationService = NotificationService;
