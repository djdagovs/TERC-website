// Pars init
Parse.initialize("BbDcEO7NKHStcQzJsx40YJ5EaEfVUIdyQZwx1zBM", "NnhaMPrC3SjUem7lhPtrIX7oOejmm0Lcw2hcuRAt");

// When one of the options are clicked
function option_clicked(id){
	id = parseInt(id);
	var links = {
		'link1':'algae.html',
		'link2':'species.html',
		'link3':'water.html',
		'link4':'beach.html'
	};
	if(id == 1){
		window.location=links.link1;
	}
	if(id == 2){
		window.location=links.link2;
	}
	if(id == 3){
		window.location=links.link3;
	}
	if(id == 4){
		window.location=links.link4;
	}
}

// Get the counts from the db's for the pill's
var Algae = Parse.Object.extend("Algae");
var queryObject = new Parse.Query(Algae);
queryObject.find({
	success: function(results){
		$(".badge-algae").html(results.length);
	}
});
var Species = Parse.Object.extend("Species");
var queryObject = new Parse.Query(Species);
queryObject.find({
	success: function(results){
		$(".badge-species").html(results.length);
	}
});
var Water = Parse.Object.extend("Water");
var queryObject = new Parse.Query(Water);
queryObject.find({
	success: function(results){
		$(".badge-water").html(results.length);
	}
});
var Beach = Parse.Object.extend("Beach");
var queryObject = new Parse.Query(Beach);
queryObject.find({
	success: function(results){
		$(".badge-beach").html(results.length);
	}
});

function initMap() {
	var map;
	var myLatlng = new google.maps.LatLng(39.095, -120.050);
	var mapOptions = {
		zoom: 11,
		center: myLatlng,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.HYBRID
	}

	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	var Beach = Parse.Object.extend("Beach");
	var queryObject = new Parse.Query(Beach);

	// Info screen:
	var infowindow = new google.maps.InfoWindow({
		content: "..."
	});

	// New query
	queryObject.find({
		success: function (results) {
			// For every element in the DB with a GeoPoint

			for (var i = 0; i < results.length; i++) {
				var current = results[i];
				var location = current.get("Location");
				if(location !== undefined){
					var lat = current.get("Location").latitude;
					var longit = current.get("Location").longitude;
				}

				// Create a new point on the map
				var latlng = new google.maps.LatLng(lat, longit);
				var imgUrl = "#";

				var fillColor = "#ED8B00";
				if(current.get("Image") != undefined){
					imgUrl = current.get("Image")._url;
					fillColor = "#d35400";
				}

				var thisMarker = new google.maps.Marker({
					id: current.id,
					dog_poop: current.get("Dog_poop"),
					cans: current.get("Cans"),
					image: imgUrl,
					cigarette: current.get("Cigarette"),
					experience: current.get("Experience"),
					glass: current.get("Glass"),
					observations: current.get("Observations"),
					litter: current.get("Litter"),
					odor: current.get("Odor"),
					clarity: current.get("Clarity"),
					paper: current.get("Paper"),
					plastic: current.get("Plastic"),
					createdAt: current.get("createdAt"),
					userId: current.get("User"),
					icon: {
					    path: google.maps.SymbolPath.CIRCLE,
					    strokeColor: "#ED8B00",
					    fillColor: fillColor,
					    fillOpacity: 1,
					    scale: 5
					},
					position: latlng,
					map: map,
					title: "An observation"
				});
				google.maps.event.addListener(thisMarker, 'click', function() {

					console.log(this.id);

					var contentString = '<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h1 id="firstHeading" class="firstHeading">Beach Observation</h1>'+
					'<div id="bodyContent">'+
					'<table class="maps-table">';


					if(this.litter != "" && this.litter != undefined){
						var litter;
						if(this.litter == "No"){
							litter = "None";
						}
						if(this.litter == "Some"){
							litter = "Some litter";
						}
						if(this.litter == "Mess"){
							litter = "A lot of litter";
						}
						contentString = contentString +
						'<tr>'+
							'<td><b>Litter</b>'+
							'</td>'+
							'<td>'+litter+
							'</td>'+
						'</tr>';
					}

					var observed = 0;
					var saw = [];
					if(this.paper == "Yes"){
						saw[observed] = "paper";
						observed = observed + 1;
					}
					if(this.plastic == "Yes"){
						saw[observed] = "plastic";
						observed = observed + 1;
					}
					if(this.glass == "Yes"){
						saw[observed] = "glass";
						observed = observed + 1;
					}
					if(this.cans == "Yes"){
						saw[observed] = "cans";
						observed = observed + 1;
					}
					if(this.cigarette == "Yes"){
						saw[observed] = "cigarette butts";
						observed = observed + 1;
					}
					if(this.dog_poop == "Yes"){
						saw[observed] = "dog poop";
						observed = observed + 1;
					}

					if(observed != 0){
						contentString = contentString +
						'<tr>'+
							'<td><b>The following were observed:</b>'+
							'</td>'+
							'<td class="caps-me">';
						for(i = 0; i < observed; i++){
							contentString = contentString + saw[i] + ', ';
						}
						contentString = contentString + 
							'</td>'+
						'</tr>';
					}

					if(this.experience != "" && this.experience != undefined){
						var experience = this.experience / 10;
						contentString = contentString +
						'<tr>'+
							'<td><b>Experience</b>'+
							'</td>'+
							'<td>'+experience+'/10'+
							'</td>'+
						'</tr>';
					}
					if(this.odor != "" && this.odor != undefined){
						var odor;
						if(this.odor == "No"){
							odor = "No odor";
						}
						if(this.odor == "Good"){
							odor = "Smells good";
						}
						if(this.odor == "Stinky"){
							odor = "Stinky!";
						}
						contentString = contentString +
						'<tr>'+
							'<td><b>Odor</b>'+
							'</td>'+
							'<td>'+odor+
							'</td>'+
						'</tr>';
					}
					if(this.observations != "" && this.observations != undefined){
						contentString = contentString +
						'<tr>'+
							'<td><b>Observations</b>'+
							'</td>'+
							'<td>'+this.observations+
							'</td>'+
						'</tr>';
					}
					
					
					if(this.createdAt != "" && this.createdAt != undefined){
						var h = this.createdAt.getHours();
						var ampm = h >= 12 ? 'pm' : 'am';
						h = h % 12;
						h = h ? h : 12;
						contentString = contentString +
						'<tr>'+
							'<td><b>Observation date</b>'+
							'</td>'+
							'<td>'+h+':'+this.createdAt.getMinutes()+' '+ampm+' '+this.createdAt.getMonth()+'/'+this.createdAt.getDate()+'/'+this.createdAt.getFullYear()+
							'</td>'+
						'</tr>';
					}

					if(this.image !== "#"){
						contentString = contentString + 
						'<tr>'+
								'<td>'+
								'</td>'+
								'<td><a href="'+this.image+'" target="_blank"><img src="'+this.image+'" width="200px"></a>'+
								'</td>'+
							'</tr>';
					}

					var q = new Parse.Query(Parse.User);
					q.equalTo("objectId", this.userId.id);
					q.find({
						success: function(found) {
							var username = found[0].getUsername();
							if(found[0].get("anon") == true){
								username = "Anonymous user";
							}
							if(found[0].get("fbid") != undefined){
								username = found[0].get("name").split(' ').slice(0, -1).join(' ');
							}
							contentString = contentString +
							'<tr>'+
								'<td><b>By the following user:</b>'+
								'</td>'+
								'<td>'+username+
								'</td>'+
							'</tr>'+
							'</table>'+
							'</div>'+
							'</div>';

						infowindow.setContent(contentString);
						}
					});
					
					infowindow.open(map, this);
				});
			}
		},
		error: function (error) {
			console.log("Error: " + error.code + " " + error.message);
		}
	});
}