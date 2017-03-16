var nconf = require('nconf');
var Twit = require('twit');
var _ = require('lodash');
var express = require("express");


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var newText = "                                                                                                               " +
            "                                                                                                                 " +
            "                                                                                                                 " ;
var currentTweet = "";

var temp = 0;
var keyword = "#trumpbudget";

 var otherVar = setInterval(addletter, 200);

     function addletter(){
         temp+=1;
         newText += currentTweet.charAt(temp);
         newText = newText.substr(1);

        return newText;
    }


//var app = express();
app.set('view engine', 'ejs');

app.use(express.static("./public/"));


app.get("/", function(req, res){
    //console.log(req.method);
    // getTweet();
    res.render('index');
});


nconf.file({ file: 'config.json' }).env();

var twitter = new Twit({
    consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
    consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
    access_token: nconf.get('TWITTER_ACCESS_TOKEN'),
    access_token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET')
});
var tweetStream = twitter.stream('statuses/filter', { track: keyword});

    tweetStream.on('tweet', function (tweet) {
         currentTweet += tweet.text;
    });

io.on('connection', function(socket){
    setInterval(function(){
        socket.emit('newT', newText);
    }, 500);
    socket.on('newT', function(msg){
        // io.emit('newT', msg); //good one!!!!
        io.emit('newT', newText);
        //console.log(msg);
    });
});

http.listen(3000, function(){
    console.log("We are listening on port 3000!");
});


