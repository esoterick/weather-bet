'use strict';

var Mongoose = require('mongoose');
var Promise = require("bluebird");
var rp = require('request-promise');
var mongo_host = process.env.MONGO_HOST;
var mongo_database = process.env.MONGO_DATABASE;
var myConnection = Mongoose.connect('mongodb://' + mongo_host + '/' + mongo_database);

var TemperatureSchema = new Mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  temp: {
    type: Number,
    required: true
  }
});

var Temperature = myConnection.model('temerature', TemperatureSchema);

var uri = 'https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22Clifton%20Park%2C%20NY%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

var myTemperature = new Temperature({});

var options = {
    uri : uri,
    method : 'GET'
};

var api_key = process.env.MAILGUN_KEY;
var domain = process.env.MAILGUN_DOMAIN;
var mail_to = process.env.MAILGUN_TO;

var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var mail_data = {
  from: 'Weather Bet <weather@codingkills.io>',
  to: mail_to,
  subject: 'Congrats',
  text: 'You Won! The weather reached 90 degrees...'
};

var temp = 0;

rp(options)
  .then(function (data) {
    var jTemp = JSON.parse(data)['query']['results']['channel']['item']['condition']['temp'];
    myTemperature.temp = jTemp;
    temp = jTemp;
    return myTemperature.save();
  }).then(function (data) {
    if (parseInt(temp) >= 90) {
      return mailgun.messages().send(mail_data)
    } else {
      return process.exit();
    }
  }).then(function (body) {
    return process.exit();
  }).catch(function (err) {
    if (err) {
      console.error(err);
    }
    process.exit();
  });
