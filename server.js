const express = require("express");
const cors = require('cors')
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const authController = require('./auth/auth');
const authJwtController = require('./auth/auth_jwt');
const jwt = require('jsonwebtoken');

const User = require('./usermgr/schema/user');
const Movie = require('./moviemgr/schema/movie');
const userMgr = require('./usermgr/common/usermgr');
const movieMgr = require('./moviemgr/common/moviemgr');
require('./db.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());

const router = express.Router();

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

app.use('/', router);
app.use(function (req, res) {
    getBadRouteJSON(req, res, "this URL path");
});
app.listen(process.env.PORT || 8080);

module.exports = app; // for testing