'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var votingTypeEnum = {
    values: ['once', 'recurring'],
    message: 'Invalid voting type found: "{VALUE}"'
};

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
    answers: [{
        type: {
            title: {type: String, required: 'Answer cannot be blank'},
            votes: [Schema.ObjectId]
        }
    }],
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
