'use strict';

var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var Voting = mongoose.model('Voting');
var Recurring = mongoose.model('Recurring');

var RecurringService = function(voting) {
    var hour = voting.recurrence.hour;
    var minute = voting.recurrence.minute;
    var weekDays = voting.recurrence.weekDays;
    var weekDaysString = filterWeekDays(weekDays).join(",");
    var cronString = createCronString(0, minute, hour, weekDaysString);

    new CronJob(cronString, function () {
        Voting.findOne({title: voting.title}, function (err, voting) {
            voting.start = Date.now();
            voting.end = addDays(new Date(), nextDayInWeekDays(weekDays)).getTime();
            console.log(voting.end);
            voting.save();
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
    return [0, 1, 2, 3, 4, 5, 6].filter(function(wd) {
        return weekDays[wd];
    }).map(function(v) {
        return (v + 1) % 7;
    });

}

function addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}

exports.recurringService = RecurringService;
