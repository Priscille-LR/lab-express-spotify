require('dotenv').config();

const { response } = require('express');
const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

//render home page
app.get('/', (req, res) => {
  res.render('index');
});

//get artists
app.get('/artist-search', (req, res) => {
  const { artist } = req.query;
  //console.log('artist:', artist)

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      //console.log('The received data from the API: ', data.body.artists.items);
      res.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

//get albums of an artist
app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params;
  //console.log('params:', artistId);

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      //console.log('albums:', data.body.items)
      res.render('albums', { albums: data.body.items });
    })
    .catch((err) =>
      console.log('The error while searching albums occurred: ', err)
    );
});

//get tracks of an album
app.get('/albums/:albumId/tracks', (req, res, next) => {
  const { albumId } = req.params;
  //console.log('params:', albumId);

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      //console.log('tracks:', data.body.items)
      res.render('tracks', { tracks: data.body.items });
    })
    .catch((err) =>
      console.log('The error while searching tracks occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
