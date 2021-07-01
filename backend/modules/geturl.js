const apikey = '18037e266bb353c7e767e537f3c5041c';

function URL(prefix, postfix=`&language=en-US&page=1`)
{
    url = `https://api.themoviedb.org/3/${ prefix }?api_key=${ apikey }${ postfix }`;
    return url;
}

module.exports = { URL };