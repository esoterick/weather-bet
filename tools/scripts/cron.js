'use strict';

var Mongoose = require('mongoose');
var Promise = require("bluebird");
var myConnection = Mongoose.connect('mongodb://localhost/mean-dev');
var rp = require('request-promise');

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
        console.log(jTemp);
        myTemperature.temp = jTemp;
        return myTemperature.save();
    }).then(function (data) {
        console.log(data);
        return process.exit();
    }).catch(function (err) {
        console.error(err);
        process.exit();
    });


// Request(url).then(function (err, res, data) {
//     console.log('data: ' + data);
//     return myTemperature.save();
// }).then(function (err) {
//     console.log('error: ' + err);
// });

// Request(url).then(function (err, response, body) {
//     if (!err && response.statusCode == 200) {
//         var jTemp = JSON.parse(body)['query']['results']['channel']['item']['condition']['temp'];
//         myTemperature.temp = jTemp;
//     } else {
//         console.log('error: ' + err);
//     }
//     return myTemperature.save();
// }).then(function () {
//     console.log('error: ' + err);
// });



// fs.readFileAsync("file.json").then(JSON.parse).then(function(val) {
//     console.log(val.success);
// })
// .catch(SyntaxError, function(e) {
//     console.error("invalid json in file");
// })
// .catch(function(e) {
//     console.error("unable to read file");
// });



//  var Temperature = myConnection.model('temerature', TemperatureSchema);
// var myTemperature = new Temperature({ temp: 82 });
// myTemperature.save(function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(myTemperature);
//     }    
//     Mongoose.connection.close();
// });

// Temperature.find({ temp: { $gt: 10 } }).limit(10).exec(function (err, doc){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(doc);
//     }
//     Mongoose.connection.close();
// });

// Request('https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22Clifton%20Park%2C%20NY%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function (error, response, body) {
//      if (!error && response.statusCode == 200) {
//      console.log(body);
//      }
// });