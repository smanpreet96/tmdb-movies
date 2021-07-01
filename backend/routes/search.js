var fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
var geturl = require('../modules/geturl');

/* GET multi search results. */
router.get('/:category/:query', function(req, res) {
  url = geturl.URL(`search/${ req.params.category }`, `&language=en-US&query=${ req.params.query }&adult=false`);
  fetch(url).then(res => res.json()).then(json => {
    var reply = [];
    var results = Object.values(json.results);
    // console.log(results);
    for(let i = 0; i<results.length; i++) {
      if(results[i].backdrop_path)
      {
        if(results[i].media_type == "movie" || "tv")
        {
          obj = {};
          obj['id'] = results[i].id;
          let type = results[i].media_type;
          if (type == "movie")
          {
            obj['name'] = results[i].title;
            obj['release_date'] = results[i].release_date;
          }
          else
          {
            obj['name'] = results[i].name;
            obj['release_date'] = results[i].first_air_date;
          }
          obj['vote_avg'] = results[i].vote_average?results[i].vote_average:0;
          obj['image_path'] = results[i].poster_path?"https://image.tmdb.org/t/p/original" + results[i].poster_path:results[i].poster_path;
          obj['backdrop_path'] = "https://image.tmdb.org/t/p/w500" + results[i].backdrop_path;
          obj['media_type'] = type;
          reply.push(obj);
        }
      }
    }
    res.header('Access-Control-Allow-Origin', "*");
    res.status(200).json(reply).end();
  });
});

module.exports = router;
