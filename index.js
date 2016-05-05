var Twitter = require('twitter');
var getCaption = require('captionbot');
var twitText = require('twitter-text');
var getURLs = require('get-urls');
var unshorten = require('unshorten');
var client = new Twitter(require('./config.js'));

var post = status => {
    client.post('statuses/update',{status},function(error, tweet, response){
        if(error) console.error(error);
        console.log(tweet);
        console.log(response);
    });
};

client.stream('statuses/filter', { track: '@caption_bot' }, function (stream) {
    stream.on('data', function (tweet) {
        var posted = false;
        getURLs(tweet.text).forEach(url => {
            console.log("1", url);
            unshorten(url, link => {
                posted = true;
                console.log("2", url);
                getCaption(link).then(caption => post(`@${tweet.user.screen_name} ${caption}`));
            });
            if(!posted) {
                console.log("3", url);
                getCaption(url).then(caption => {post(`@${tweet.user.screen_name} ${caption}`)})
                .catch(e => console.error(e));
            }
        });
    });

    stream.on('error', function (error) {
        throw error;
    });
});

