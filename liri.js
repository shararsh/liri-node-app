var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

var command = process.argv[2];
var commandArgument = process.argv[3];

switch (command) {

	case 'my-tweets':
		myTweets();
		break;

	case 'spotify-this-song':
		mySpotify(commandArgument);
		break;

	case 'movie-this':
		movieThis(commandArgument);
		break;

	case 'do-what-it-says':
		doWhatItSays();
		break;

	default:
		console.log("Command not Valid. Please try again!");
}

function myTweets() {

	var client = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret
	});

	client.get('statuses/user_timeline', {count: 20, trim_user: false, exclude_replies: true, include_rts: false}, function(error, tweets, response) {

		if (!error) {
			for (var i=0; i<tweets.length; i++) {
				console.log(tweets[i].created_at);
				console.log(tweets[i].text);
				}
			}
	});

}

function mySpotify(receivedSong) {

	var mySong = receivedSong ? receivedSong : 'The Sign Ace of Base';

	spotify.search({ type: 'track', query: mySong }, function(err, data) {

		if ( err ) {
        	return console.log('Error occurred: ' + err);
    	}
			console.log('Artist Name: ' + data.tracks.items[0].artists[0].name);
			console.log('Song Name: ' + data.tracks.items[0].name);
			console.log('Preview Link: ' + data.tracks.items[0].preview_url);
			console.log('Album Title: ' + data.tracks.items[0].album.name);
	});
}

function movieThis(receivedMovie) {


	var myMovie = receivedMovie ? receivedMovie : 'Mr. Nobody';

	Request("http://www.omdbapi.com/?t=" + myMovie + "&y=&plot=short&apikey=40e9cece", function (error, response, body) {
												
		if (!error && response.statusCode === 200) {

    		console.log('Movie Title: ' + JSON.parse(body).Title);
    		console.log('Release Year: ' + JSON.parse(body).Year);
    		console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
    		console.log('Production Country: ' + JSON.parse(body).Country);
    		console.log('Language: ' + JSON.parse(body).Language);
    		console.log('Plot: ' + JSON.parse(body).Plot);
    		console.log('Actors/Actresses: ' + JSON.parse(body).Actors);
  		}

	});

}

function doWhatItSays() {

	fs.readFile('random.txt', 'utf8', function(error, data) {

	if (error) return console.log('Filesystem Read Error: ' + error);

	var dataObject = data.split(',');
	var myFunction = dataObject[0];
	var myArgument = dataObject[1];

	switch (myFunction) {
		case 'my-tweets':
			myFunction = 'myTweets';
			break;
		case 'spotify-this-song':
			myFunction = 'mySpotify';
			break;
		case 'movie-this':
			myFunction = 'movieThis';
			break;
		default:
			console.log('Unexpected error in doWhatItSays function');
	}

	eval(myFunction)(myArgument);

	});

}
