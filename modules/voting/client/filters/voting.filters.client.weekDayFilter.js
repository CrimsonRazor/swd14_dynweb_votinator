angular.module('voting').filter("weekDayFilter", function() {
    return function(weekDay) {
        return ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"][weekDay % 7];
    }
});
