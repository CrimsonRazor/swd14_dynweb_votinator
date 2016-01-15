'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const votingTypeEnum = {
    values: ['once-only', 'recurring'],
    message: 'Invalid voting type found: "{VALUE}"'
};
const answerTypeEnum = {
    values: ['single', 'multiple'],
    message: 'Invalid answer type found: "{VALUE}"'
};

/**
 * Recurring Schema
 */
var RecurringSchema = new Schema({
    weekDays: [{type: Boolean, default: false, required: 'WeekDays cannot be blank'}],
    hourOfDay: {type: Number, min: 0, max: 23, required: 'Hour of day cannot be blank'},
    minute: {type: Number, min: 0, max: 59, required: 'Minute cannot be blank'}
});

/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
    title: {type: String, required: 'Answer cannot be blank'},
    votes: [Schema.ObjectId]
});

/**
 * Voting Schema
 */
var VotingSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        trim: true,
        required: 'Title cannot be blank'
    },
    answers: [AnswerSchema],
    answerType: {
        type: String,
        enum: answerTypeEnum
    },
    votingType: {
        type: String,
        enum: votingTypeEnum
    },
    start: {
        type: Date,
        default: Date.now,
        required: true
    },
    end: {
        type: Date,
        required: 'End date must be specified'
    },
    recurrence: {
        type: RecurringSchema
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Voting', VotingSchema);
mongoose.model('Answer', AnswerSchema);
mongoose.model('Recurring', RecurringSchema);
