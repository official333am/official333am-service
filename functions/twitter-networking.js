const express = require('express');
var Twitter = require('twitter');
var router = express.Router();

var client = new Twitter({
	consumer_key: 'c1bO9Gh8bXfIUCnht3TI6zONA',
	consumer_secret: 'pNouWBHcXdREirApKsgQf8fj3dioagyN54Tqto1tHpHKaY5nzK',
	access_token_key: '1179654224814202880-eTRxO8AowsPa9SVsEeT2orL57sUmyZ',
	access_token_secret: 'ugiz0dDpPhjKL8NEnZP7FPIQaSfDi7kPTQqmCIlBYir5V'
});

router.post('/direct_message', function (req, res) {
	json = req.body;

	client.post('direct_messages/events/new', 
		{
			event: {
				type: "message_create", 
				message_create: {
					target: {
						recipient_id: json.userid
					}, 
					message_data: {
						text: json.message
					}
				}
			}
		}
		, function(error, success) {
			if (error) {
				res.json({
					data: error 
				})
			} else if (success) {
				res.json({
					data: success
				});
			}
	});
});

router.post('/search', function (req, res) {
	json = req.body;
	payload = [];

	client.get('search/tweets', 
		{
			q: json.artist + ' ' + json.song,
			count: (json.search_count > 100 ? 100 : json.search_count),
			max_id: json.max_id
		}
		, function(error, success) {
			if (error) {
				res.json({
					data: error 
				})
			} else if (success) {
				success.statuses.forEach(function(status) {
					if (status.user.followers_count >=json.min_followers
						&& status.retweet_count >= json.min_retweets
						&& status.favorite_count >= json.min_likes) {
						payload.push({
								name: status.user.name,
								username: '@' + status.user.screen_name,
								userid: status.user.id,
								followers: status.user.followers_count,
								tweet: status.text,
								retweets: status.retweet_count,
								likes: status.favorite_count,
						});
					}
				});

				res.json({
					data: payload,
					max_id: success.statuses[success.statuses.length-1].id
				});
			}
	});
});

module.exports = router;