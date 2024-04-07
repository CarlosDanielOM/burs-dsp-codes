const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accessCodeSchema = new Schema({
    address: {type: String, required: true},
    status: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    code: {type: String, required: true},
    submitter: {type: String, required: true},
    rejects: {type: Number, default: 0},
    succeeds: {type: Number, default: 0},
    date: {
        day: {type: Number, default: () => new Date().getDate()},
        month: {type: Number, default: () => new Date().getMonth() + 1},
        year: {type: Number, default: () => new Date().getFullYear()}
    }
});

const AccessCode = mongoose.model('AccessCode', accessCodeSchema);

module.exports = AccessCode