const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
mongoose.connect('mongodb://localhost:27017/tech', { useNewUrlParser: true, useCreateIndex: true, });
var conn = mongoose.Collection;

var customerSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Mobile: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    DOB: {
        type: String,
        required: true,
    },
    loginId: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Customer', customerSchema);
