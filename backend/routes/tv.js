var fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
var geturl = require('../modules/geturl');

/* GET tv queries. */
router.get('/:query_type', function(req, res) {
    url = geturl.URL(`tv/${ req.params.query_type }`);
    fetch(url).then(res => res.json()).then(json => {
        var reply = [];
        if(json.results)
        {
            var results = Object.values(json.results);
            for(let i = 0; i<results.length; i++)
            {
                let obj = {};
                obj['id'] = results[i].id;
                obj['name'] = results[i].name;
                obj['image_path'] = results[i].poster_path?"https://image.tmdb.org/t/p/original" + results[i].poster_path:results[i].poster_path;
                obj['backdrop_path'] = results[i].backdrop_path?"https://image.tmdb.org/t/p/original" + results[i].backdrop_path:results[i].backdrop_path;
                reply.push(obj);
            }
        }
        else
        {
            let obj = {};
            obj['name'] = json.name;
            obj['genres'] = json.genres;
            obj['spoken_languages'] = json.spoken_languages;
            obj['first_air_date'] = json.first_air_date;
            obj['episode_run_time'] = json.episode_run_time;
            obj['overview'] = json.overview;
            obj['vote_average'] = json.vote_average;
            obj['tagline'] = json.tagline;
            reply.push(obj);
        }
        res.header('Access-Control-Allow-Origin', "*");
        res.status(200).json(reply).end();
    });
});

/* GET tv id queries. */
router.get('/:tv_id/:query_type', function(req, res) {
    let queryType = req.params.query_type;
    url = geturl.URL(`tv/${ req.params.tv_id }/${ queryType }`);
    fetch(url).then(res => res.json()).then(json => {
      var reply = [];
        if(queryType == "videos")
        {
            var results = Object.values(json.results);
            for(let i = 0; i<results.length; i++)
            {
                obj = {};
                obj['site'] = results[i].site;
                obj['type'] = results[i].type;
                obj['name'] = results[i].name;
                obj['key'] = results[i].key;
                reply.push(obj);
            }
        }
        else if (queryType == "reviews")
        {
            var results = Object.values(json.results);
            for(let i = 0; i<results.length; i++)
            {
                obj = {};
                obj['author'] = results[i].author;
                obj['content'] = results[i].content;
                obj['created_at'] = results[i].created_at;
                obj['url'] = results[i].url;
                obj['rating'] = results[i].author_details.rating;
                if(results[i].author_details.avatar_path)
                {
                    let path = String(results[i].author_details.avatar_path);
                    obj['avatar_path'] = path.includes('https') ? path.substr(1) : 'https://image.tmdb.org/t/p/original' + path;
                }
                else
                {
                    obj['avatar_path'] = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU'
                }
                reply.push(obj);
            }
        }
        else if (queryType == "credits")
        {
            var results = Object.values(json.cast);
            for(let i = 0; i<results.length; i++)
            {
                obj = {};
                obj['id'] = results[i].id;
                obj['name'] = results[i].name;
                obj['character'] = results[i].character;
                obj['profile_path'] = results[i].profile_path?'https://image.tmdb.org/t/p/w500' + results[i].profile_path:results[i].profile_path;
                reply.push(obj);
            }
        }
        else
        {
            var results = Object.values(json.results);
            for(let i = 0; i<results.length; i++)
            {
                obj = {};
                obj['id'] = results[i].id;
                obj['name'] = results[i].name;
                obj['image_path'] = 'https://image.tmdb.org/t/p/w500' + results[i].poster_path;
                reply.push(obj);
            }
        }
        res.header('Access-Control-Allow-Origin', "*");
        res.status(200).json(reply).end();
    });
});

module.exports = router;