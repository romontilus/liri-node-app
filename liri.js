require("dotenv").config();


//Grab data from keys.js
var fs = require('fs');
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var clientSpotify = require('node-spotify-api');
var spotify = new clientSpotify(keys.spotify);
var client = new twitter(keys.twitter);


//Stored argument's array
var nodes = process.argv;
var command = process.argv[2];
//movie or song
var media = "";
//attaches multiple word arguments
for (var i=3; i<nodes.length; i++){
  if(i>3 && i<nodes.length){
    media = media + "+" + nodes[i];
  } else{
    media = media + nodes[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(media){
      spotifySong(media);
    } 
    
    if(media === ""){
      spotifySong("Whatsername");
    }
  break;

  case "movie-this":
    if(media){
      omdbData(media)
    } 
    if(media === ""){
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    thatThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}


function showTweets(){
    //Display last 20 Tweets
    var screenName = {screen_name: 'shitmydadsays'};
    client.get('statuses/user_timeline', screenName, function(error, tweets, response){
      if(!error){
        for(var i = 0; i<tweets.length; i++){
          var date = tweets[i].created_at;
          console.log("@shitmydadsays: " + tweets[i].text + " Created At: " + date.substring(0, 19));
          console.log("-----------------------");
          
          //adds text to log.txt file
        //   fs.appendFileSync('log.txt', "@shitmydadsays: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        //   fs.appendFileSync('log.txt', "-----------------------");
        }
      }else{
        console.log("Something's wrong [ERROR]");
      }
    });
}

function spotifySong(song){
    spotify.search({ type: 'track', query: song, limit: 1}, function(error, data){
      if(!error){
        for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
          //artist
          console.log("Artist: " + songData.artists[0].name);
          //song name
          console.log("Song: " + songData.name);
          //spotify preview link
          console.log("Preview URL: " + songData.preview_url);
          //album name
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");
          
          //adds text to log.txt
        //   fs.appendFileSync('log.txt', songData.artists[0].name);
        //   fs.appendFileSync('log.txt', songData.name);
        //   fs.appendFileSync('log.txt', songData.preview_url);
        //   fs.appendFileSync('log.txt', songData.album.name);
        //   fs.appendFileSync('log.txt', "-----------------------");
        }
      } else{
        console.log("Something's wrong [ERROR]");
      }
    });
  }

  function omdbData(movie){
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=ff1176f0';
  
    request(omdbURL, function (error, response, body){
      if(!error && response.statusCode == 200){
        var body = JSON.parse(body);
        
        console.log("Title: " + body.Title);
        console.log("Release Year: " + body.Year);
        console.log("IMdB Rating: " + body.imdbRating);
        console.log("Country: " + body.Country);
        console.log("Language: " + body.Language);
        console.log("Plot: " + body.Plot);
        console.log("Actors: " + body.Actors);

        //adds text to log.txt
        // fs.appendFileSync('log.txt', "Title: " + body.Title);
        // fs.appendFileSync('log.txt', "Release Year: " + body.Year);
        // fs.appendFileSync('log.txt', "IMdB Rating: " + body.imdbRating);
        // fs.appendFileSync('log.txt', "Country: " + body.Country);
        // fs.appendFileSync('log.txt', "Language: " + body.Language);
        // fs.appendFileSync('log.txt', "Plot: " + body.Plot);
        // fs.appendFileSync('log.txt', "Actors: " + body.Actors);
  
      } else{
        console.log("Something's wrong [ERROR]");
    }
      if(body.Title === "Mr. Nobody"){
        console.log("-----------------------");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
  
        //adds text to log.txt
        // fs.appendFileSync('log.txt', "-----------------------");
        // fs.appendFileSync('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        // fs.appendFileSync('log.txt', "It's on Netflix!");
      }
    });
  
  }

function thatThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
   
   if (!error) {

    data = data.split(',');
//    fs.appendFileSync('log.txt', "-----------------------");
//    fs.appendFileSync('log.txt', "They actually did that thing... :/");
    spotifySong(data[1]);
   }

   else {
       console.log("Something's wrong [ERROR]");
   }
  });
}
