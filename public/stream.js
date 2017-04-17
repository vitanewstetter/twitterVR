var nconf = require('nconf');
var Twit = require('twit');
var _ = require('lodash');
var express = require("express");


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//hack way of starting the feed empty and then filling it with the right amount letters
var newText1 = "                                                                                                               " +
            "                                                                                                                 " +
            "                                                                                                                 " ;
var newText2 = "                                                                                                               " +
    "                                                                                                                 " +
    "                                                                                                                 " ;
var newText3 = "                                                                                                               " +
    "                                                                                                                 " +
    "                                                                                                                 " ;
var currentTweet1 = "";
var currentTweet2 = "";
var currentTweet3 = "";

var temp1 = 0;
var temp2 = 0;
var temp3 = 0;

//queries for each line - currently searching these:
var keyword1 = "yesterday";
var keyword2 = "today";
var keyword3 = "tomorrow";

var otherVar1 = setInterval(addletter1, 75);
var otherVar2 = setInterval(addletter2, 75);
var otherVar3 = setInterval(addletter3, 75);
//change texture for ring1
function addletter1(){
         temp1+=1;

         newText1 += currentTweet1.charAt(temp1);
         newText1 = newText1.substr(1);

         return newText1;
    }
//change texture for ring2
function addletter2(){
    temp2+=1;

    newText2 += currentTweet2.charAt(temp2);
    newText2 = newText2.substr(1);

    return newText2;
}
//change texture for ring3
function addletter3(){
    temp3+=1;

    newText3 += currentTweet3.charAt(temp3);
    newText3 = newText3.substr(1);

    return newText3;
}


//var app = express();
app.set('view engine', 'ejs');

app.use(express.static("./public/"));


app.get("/", function(req, res){
    res.render('index');
});


nconf.file({ file: 'config.json' }).env();

var twitter = new Twit({
    consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
    consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
    access_token: nconf.get('TWITTER_ACCESS_TOKEN'),
    access_token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET')
});

//get twitter stream for each keyword
var tweetStream1 = twitter.stream('statuses/filter', { track: keyword1});
var tweetStream2 = twitter.stream('statuses/filter', { track: keyword2});
var tweetStream3 = twitter.stream('statuses/filter', { track: keyword3});

    tweetStream1.on('tweet', function (tweet) {
         currentTweet1 += tweet.text;
    });

    tweetStream2.on('tweet', function (tweet) {
        currentTweet2 += tweet.text;
    });

    tweetStream3.on('tweet', function (tweet) {
        currentTweet3 += tweet.text;
    });

io.on('connection', function(socket){
    setInterval(function(){
        socket.emit('newT1', newText1);
    }, 501);
    setInterval(function(){
        socket.emit('newT2', newText2);
    }, 500);
    setInterval(function(){
        socket.emit('newT3', newText3);
    }, 499);
    socket.on('newT1', function(msg){
        io.emit('newT1', newText1);
    });
    socket.on('newT2', function(msg){
        io.emit('newT2', newText2);
    });
    socket.on('newT3', function(msg){
        io.emit('newT3', newText3);
    });
});

http.listen(3000, function(){
    console.log("We are listening on port 3000!");
});


