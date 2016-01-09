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
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Voting', VotingSchema);
mongoose.model('Answer', AnswerSchema);
