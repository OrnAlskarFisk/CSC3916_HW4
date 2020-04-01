const express = require("express");
const got = require('got');
const cors = require('cors')
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const authController = require('./auth/auth');
const authJwtController = require('./auth/auth_jwt');
const jwt = require('jsonwebtoken');

const User = require('./usermgr/schema/user');
const Movie = require('./moviemgr/schema/movie');
const Review = require('./reviewmgr/schema/review')

const userMgr = require('./usermgr/common/usermgr');
const movieMgr = require('./moviemgr/common/moviemgr');
const reviewMgr = require('./reviewmgr/common/reviewmgr')
require('./db.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.enable('trust proxy');
app.use(passport.initialize());

const router = express.Router();
const {GA_TRACKING_ID} = process.env;

const trackEvent = (category, action, label, value) => {
    const data = {
        // API Version.
        v: '1',
        // Tracking ID / Property ID.
        tid: GA_TRACKING_ID,
        // Anonymous Client Identifier. Ideally, this should be a UUID that
        // is associated with particular user, device, or browser instance.
        cid: '555',
        // Event hit type.
        t: 'event',
        // Event category.
        ec: category,
        // Event action.
        ea: action,
        // Event label.
        el: label,
        // Event value.
        ev: value,
    };
    return got.post('http://www.google-analytics.com/collect', data);
};
function trackDimension(category, action, label, value, dimension, metric){
    var options = {method: 'GET',
    url: 'http://www.google-analytics.com/collect',
    qs:
        {
            // API Version.
            v: '1',
            // Tracking ID / Property ID.
            tid: GA_TRACKING_ID,
            // Anonymous Client Identifier. Ideally, this should be a UUID that
            // is associated with particular user, device, or browser instance.
            cid: '555',
            // Event hit type.
            t: 'event',
            // Event category.
            ec: category,
            // Event action.
            ea: action,
            // Event label.
            el: label,
            // Event value.
            ev: value,
            //Custom Dimension
            cd1: dimension,
            //custom Metric
            cm1: metric
        },
     headers:
         {'Cache-Control': 'no-cache'}
    };
    return rp(options);
}
app.get('/', async (req, res, next) => {
    // Event value must be numeric.
    try {
        await trackEvent(
            'Example category',
            'Example action',
            'Example label',
            '100'
        );
        res.status(200).send('Event tracked.').end();
    } catch (error) {
        // This sample treats an event tracking error as a fatal error. Depending
        // on your application's needs, failing to track an event may not be
        // considered an error.
        next(error);
    }
});

function getBadRouteJSON(req, res, route) {
    res.json({success: false, msg: req.method + " requests are not supported by " + route});
}

function getJSONObject(req) {
    const json = {
        headers: "No Headers",
        key: process.env.SECRET_KEY,
        body: "No Body"
    };

    if (req.body != null) {
        json.body = req.body;
    }
    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

function getMoviesJSONObject(req, msg) {
    const json = {
        status: 200,
        message: msg,
        headers: "No Headers",
        query: "No Query String",
        env: process.env.SECRET_KEY
    };

    if (req.query != null) {
        json.query = req.query;
    }
    if (req.headers != null) {
        json.headers = req.headers;
    }
    return json;
}

router.route('/post')
    .post(authController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            const o = getJSONObject(req);
            res.json(o);
        }
    );

router.route('/postjwt')
    .post(authJwtController.isAuthenticated, function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            res.send(req.body);
        }
    );

router.route('/findallusers')
    .post(userMgr.findAllUsers);

router.route('/signup')
    .post(userMgr.signUp)
    .all(function (req, res) {
        getBadRouteJSON(req, res, "/signup");
    });

router.route('/signin')
    .post(userMgr.signIn)
    .all(function (req, res) {
        getBadRouteJSON(req, res, "/signin");
    });

router.route('/movies')
    .get(
        authJwtController.isAuthenticated,
        movieMgr.getMovies
    )
    .post(
        authJwtController.isAuthenticated,
        movieMgr.postMovie
    )
    .put(
        authJwtController.isAuthenticated,
        movieMgr.putMovie
    )
    .delete(
        authJwtController.isAuthenticated,
        movieMgr.deleteMovie
    )
    .all(function (req, res) {
        getBadRouteJSON(req, res, "/movies");
    });

router.route('/reviews')
    .get(
        reviewMgr.getReviews
    )
    .post(
        authJwtController.isAuthenticated,
        reviewMgr.postReview
    )
    .all(
        function (req, res) {
            getBadRouteJSON(req, res, "/movies");
        });


app.use('/', router);
app.use(function (req, res) {
    getBadRouteJSON(req, res, "this URL path");
});
app.listen(process.env.PORT || 8080);

module.exports = app; // for testing