var fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
var geturl = require('../modules/geturl');

/* GET person query. */
router.get('/:person_id', function(req, res) {
    url = geturl.URL(`person/${ req.params.person_id }`);
    fetch(url).then(res => res.json()).then(json => {
        var reply = [];
        let obj = {};
        obj['birthday'] = json.birthday;
        obj['gender'] = json.gender;
        obj['name'] = json.name;
        obj['homepage'] = json.homepage;
        obj['also_known_as'] = json.also_known_as;
        obj['known_for_department'] = json.known_for_department;
        obj['biography'] = json.biography;
        obj['place_of_birth'] = json.place_of_birth;
        obj['profile_path'] = "https://image.tmdb.org/t/p/w500"+json.profile_path;
        reply.push(obj);
        res.header('Access-Control-Allow-Origin', "*");
        res.status(200).json(reply).end();
    });
});

/* GET person id queries. */
router.get('/:person_id/:query_type', function(req, res) {
    url = geturl.URL(`person/${ req.params.person_id }/${ req.params.query_type }`);
    fetch(url).then(res => res.json()).then(json => {
        var reply = [];
        let obj = {};
        obj['imdb_id'] = json.imdb_id;
        obj['facebook_id'] = json.facebook_id;
        obj['instagram_id'] = json.instagram_id;
        obj['twitter_id'] = json.twitter_id;
        reply.push(obj);
        res.header('Access-Control-Allow-Origin', "*");
        res.status(200).json(reply).end();
    });
});

module.exports = router;