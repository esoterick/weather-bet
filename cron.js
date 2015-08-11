'use strict';

var Mongoose = require('mongoose');
var Promise = require("bluebird");
var rp = require('request-promise');
var myConnection = Mongoose.connect('mongodb://localhost/mean-dev');

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

rp(options)
    .then(function (data) {
        var jTemp = JSON.parse(data)['query']['results']['channel']['item']['condition']['temp'];
        myTemperature.temp = jTemp;
        return myTemperature.save();
    }).then(function (data) {
        return process.exit();
    }).catch(function (err) {
        process.exit();
    });