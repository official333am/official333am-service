const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

var twitterNetworking = require('./twitter-networking.js')

var app = express();

app.use(cors());

app.get('/api', (request, response) => {
    response.json({ 
        date: `${Date.now()}`
    });
});

app.use('/api/twitter', twitterNetworking);

exports.app = functions.https.onRequest(app);
