const express = require('express');
const axios = require('axios');
const router = express.Router();
const { checkAuthMiddleware } = require('../middleware');

// Fetch user's devices
router.get('/devices', checkAuthMiddleware, async (req, res) => {
  try {
    const accessToken = req.user.accessToken;
    const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
    res.json(response.data.devices);
  } catch (error) {
    console.error('Error fetching devices:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching devices');
  }
});

router.put('/devices/:deviceId/activate', checkAuthMiddleware, async (req, res) => {
  const deviceId = req.params.deviceId;
  try {
    const accessToken = req.user.accessToken;
    await axios.put(`https://api.spotify.com/v1/me/player`, {
      device_ids: [deviceId]
    }, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error activating device:', error.response ? error.response.data : error.message);
    res.status(500).send('Error activating device');
  }
});

// Fetch user playlists
router.get('/playlists', checkAuthMiddleware, async (req, res) => {
  const accessToken = req.user.accessToken;

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching playlists:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching playlists');
  }
});

// Fetch liked songs
router.get('/liked-songs', checkAuthMiddleware, async (req, res) => {
  const accessToken = req.user.accessToken;

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching liked songs:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching liked songs');
  }
});

// Fetch recommendations
router.get('/recommendations', checkAuthMiddleware, async (req, res) => {
  const accessToken = req.user.accessToken;

  try {
    const recentlyPlayedResponse = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    const seedTracks = recentlyPlayedResponse.data.items.map(item => item.track.id).slice(0, 5).join(',');

    const recommendationsResponse = await axios.get(`https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    const recommendations = recommendationsResponse.data.tracks.map(track => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        image: track.album.images[0].url
      };
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Error retrieving recommendations:', error.response ? error.response.data : error.message);
    res.status(500).send('Error retrieving recommendations');
  }
});

// Fetch recently played tracks
router.get('/recently-played', checkAuthMiddleware, async (req, res) => {
  const accessToken = req.user.accessToken;

  try {
    const recentlyPlayedResponse = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    const trackIds = recentlyPlayedResponse.data.items.map(item => item.track.id).join(',');

    const audioFeaturesResponse = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    const data = {
      recentlyPlayed: recentlyPlayedResponse.data,
      audioFeatures: audioFeaturesResponse.data
    };

    res.json(data);
  } catch (error) {
    console.error('Error retrieving recently played tracks:', error.response ? error.response.data : error.message);
    res.status(500).send('Error retrieving recently played tracks');
  }
});

// Fetch user profile
router.get('/profile', checkAuthMiddleware, async (req, res) => {
  const accessToken = req.user.accessToken;

  try {
    const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    res.json(profileResponse.data);
  } catch (error) {
    console.error('Error retrieving profile information:', error.response ? error.response.data : error.message);
    res.status(500).send('Error retrieving profile information');
  }
});

// Add a song to Liked Songs
router.post('/liked-songs/:songId', checkAuthMiddleware, async (req, res) => {
  const accessToken = req.user.accessToken;
  const songId = req.params.songId;

  try {
    const response = await axios.put(`https://api.spotify.com/v1/me/tracks?ids=${songId}`, null, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    if (response.status === 200) {
      res.sendStatus(200);
    } else {
      res.status(response.status).send(response.data);
    }
  } catch (error) {
    console.error('Error adding song to Liked Songs:', error.response ? error.response.data : error.message);
    res.status(500).send('Error adding song to Liked Songs');
  }
});

// Play a song
router.put('/play-song/:songId', checkAuthMiddleware, async (req, res) => {
  const accessToken = req.user.accessToken;
  const songId = req.params.songId;

  try {
    const response = await axios.put('https://api.spotify.com/v1/me/player/play', {
      uris: [`spotify:track:${songId}`]
    }, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 204) {
      res.send('Song is playing');
    } else {
      res.status(response.status).send('Failed to play song');
    }
  } catch (error) {
    console.error('Error playing song:', error.response ? error.response.data : error.message);
    res.status(500).send('Error playing song');
  }
});

router.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000/');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
});

module.exports = router;
