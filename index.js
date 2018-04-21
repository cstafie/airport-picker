var mongoose = require('mongoose');
var csv = require('csv-parser');
var fs = require('fs');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // we're connected!
  var airportSchema = mongoose.Schema({
  	id: Number,
  	name: String,
  	city: String,
  	country: String,
  	IATA: String,
  	ICAO: String,
  	location: [Number],
  	timeZone: String,
  	type: String,
  });

  var Airport = mongoose.model("Airport", airportSchema);

  // var myAp = new Airport({id: 1, name: 'Heathrow', city: 'London', garbage:'trash'});
  // myAp.save((e,a) => {
  // 	if (e) console.log('didnt save');
  // });

  // Airport.find({name: "Heathrow"}, (e,a) => {
  // 	console.log(a);
  // });

  fs.createReadStream('airports.dat')
	  .pipe(csv())
	  .on('data', function (data) {
	  	console.log(cleanData(data));
	  	let airport = new Airport(cleanData(data));
	  	airport.save();
	  });

  console.log('not fucked');
});

function cleanData(data) {
	let clean = d => (d === "\\N") ? "" : d;

	return {
		id: clean(data.id),
		name: clean(data.name),
		city: clean(data.city),
		country: clean(data.country),
		IATA: clean(data.iata),
		ICAO: clean(data.icao),
		location: [clean(data.longitude), clean(data.latitude)],
		timeZone: clean(data.timezene),
		type: clean(data.type),
	}
}


 



