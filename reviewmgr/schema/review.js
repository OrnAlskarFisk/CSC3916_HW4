var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    movieTitle: {
        type: String,
        required: true
    },
    reviewer: {
        type: String,
        required: true
    },
    quote: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

var Review = mongoose.model('Review', reviewSchema);

module.exports = Review;