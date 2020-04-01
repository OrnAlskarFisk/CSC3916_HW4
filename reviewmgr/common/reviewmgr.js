const Movie = require("../../moviemgr/schema/movie");
const Review = require("../schema/review");
const jwt = require('jsonwebtoken');

exports.getReviews =
    (req, res) => {
        Review.find(
            req.query,
            (err, review) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(review);
            });
    };

exports.postReview =
    async function (req, res) {
        token = req.headers.authorization.substr(4);
        decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!req.body.movieTitle) {
            res.status(500).send({msg: 'movieTitle validation failed'});
        } else if (!req.body.reviewer || req.body.reviewer != decoded.username) {
            res.status(500).send({msg: 'Reviewer validation failed'});
        } else if (!req.body.quote || req.body.quote == '') {
            res.status(500).send({msg: 'Quote validation failed'});
        } else if (!req.body.rating || isNaN(req.body.rating) || (req.body.rating < 0 || req.body.rating > 5)) {
            res.status(500).send({msg: 'Rating validation failed'});
        } else {

            movie = await Movie.findOne({title: req.body.movieTitle});


            if (!movie) {
                res.status(500).send({msg: 'That Movie Does Not Exist'});
            } else {

                let review = new Review({
                    movieTitle: req.body.movieTitle,
                    reviewer: req.body.reviewer,
                    quote: req.body.quote,
                    rating: req.body.rating
                });

                review.save(
                    (err, review) => {
                        if (err) {
                            res.status(500).send(err);
                        }
                        res.status(200).send({
                            success: true,
                            msg: "Review Successfully Posted"
                        });
                    });
            }
        }
    };
