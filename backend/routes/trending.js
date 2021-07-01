var fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
var geturl = require('../modules/geturl');

/* GET trending results */
router.get('/:media_type', function(req, res) {
  url = geturl.URL(`trending/${ req.params.media_type }/day`, ``);
  fetch(url).then(res => res.json()).then(json => {
    var reply = [];
    var results = Object.values(json.results);
    for(let i = 0; i<results.length; i++) {
      obj = {};
      obj['id'] = results[i].id;
      let type = results[i].media_type;
      if (type == "movie")
      {
        obj['title'] = results[i].title;
      }
      else
      {
        obj['name'] = results[i].name;
      }
      obj['image_path'] = results[i].poster_path?"https://image.tmdb.org/t/p/original" + results[i].poster_path:results[i].poster_path;
      obj['backdrop_path'] = results[i].backdrop_path?"https://image.tmdb.org/t/p/original" + results[i].backdrop_path:results[i].backdrop_path;
      reply.push(obj);
    }
    res.header('Access-Control-Allow-Origin', "*");
    res.status(200).send(reply).end();
  });
});

module.exports = router;