var express = require('express');
var path = require('path')
var searchRouter = require('./routes/search');
var trendingRouter = require('./routes/trending');
var movieRouter = require('./routes/movie');
var tvRouter = require('./routes/tv');
var personRouter = require('./routes/person');

var app = express();

app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'dist/frontend')));

app.use('/api/search', searchRouter);
app.use('/api/trending', trendingRouter);
app.use('/api/movie', movieRouter);
app.use('/api/tv', tvRouter);
app.use('/api/person', personRouter);
app.use('/*', function( req, res ) { res.sendFile(path.join(__dirname, 'dist/frontend/index.html')) });

module.exports = app;