const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    yearReleased: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        enum: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Thriller", "Western"],
        required: true
    },
    actors: {
        type: Array,
        required: true,
        items: {
            actorName: String,
            characterName: String
        },
        minItems: 3
    }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;