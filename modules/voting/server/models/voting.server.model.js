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
    hour: {type: Number, min: 0, max: 23, required: 'Hour cannot be blank'},
    minute: {type: Number, min: 0, max: 59, required: 'Minute cannot be blank'},
    weekDays: [{type: Boolean, default: false, required: 'WeekDays cannot be blank'}]
});

/**
 * Dynamic Generation Script
 */
var DynamicGenerationScriptSchema = new Schema({
    script: {type: String, required: 'Script cannot be blank', trim: true},
    hash: {type: String, required: true},
    adminApproved: {type: Boolean, default: false}
});

/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
    title: {type: String},
    dynamicGenerationScript: {type: DynamicGenerationScriptSchema},
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
    maxAnswers: {
        type: Number
    },
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

mongoose.model('DynamicGenerationScript', DynamicGenerationScriptSchema);
mongoose.model('Answer', AnswerSchema);
mongoose.model('Recurring', RecurringSchema);
mongoose.model('Voting', VotingSchema);
