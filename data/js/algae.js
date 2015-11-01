// Pars init
Parse.initialize("BbDcEO7NKHStcQzJsx40YJ5EaEfVUIdyQZwx1zBM", "NnhaMPrC3SjUem7lhPtrIX7oOejmm0Lcw2hcuRAt");

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
		mapTypeId: google.maps.MapTypeId.HYBRID
	}

	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	var Algae = Parse.Object.extend("Algae");
	var queryObject = new Parse.Query(Algae);

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
				if(current.get("Image") != undefined){
					imgUrl = current.get("Image")._url;
				}

				var thisMarker = new google.maps.Marker({
					id: current.id,
					dog_poop: current.get("Dog_poop"),
					goose_poop: current.get("Goose_poop"),
					image: imgUrl,
					inflow: current.get("Inflow"),
					lawn: current.get("Lawn"),
					mats: current.get("Mats"),
					observations: current.get("Observations"),
					rocks: current.get("Rocks"),
					smell: current.get("Smell"),
					visible: current.get("visible"),
					createdAt: current.get("createdAt"),
					icon: {
					    path: google.maps.SymbolPath.CIRCLE,
					    strokeColor: "#16a085",
					    fillColor: "#1abc9c",
					    fillOpacity: 1,
					    scale: 5
					},
					position: latlng,
					map: map,
					title: "An observation"
				});
				google.maps.event.addListener(thisMarker, 'click', function() {

					var contentString = '<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h1 id="firstHeading" class="firstHeading">Algae Observation</h1>'+
					'<div id="bodyContent">'+
					'<table class="maps-table">'+
						'<tr>'+
							'<td><b>ID</b>'+
							'</td>'+
							'<td>'+this.id+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td><b>Dog Poop</b>'+
							'</td>'+
							'<td>'+this.dog_poop+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td><b>Goose Poop</b>'+
							'</td>'+
							'<td>'+this.goose_poop+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td><b>Inflow</b>'+
							'</td>'+
							'<td>'+this.inflow+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td><b>Lawn</b>'+
							'</td>'+
							'<td>'+this.lawn+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td><b>Mats</b>'+
							'</td>'+
							'<td>'+this.mats+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td><b>Observations</b>'+
							'</td>'+
							'<td>'+this.observations+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td><b>Rocks</b>'+
							'</td>'+
							'<td>'+this.rocks+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td><b>Smell</b>'+
							'</td>'+
							'<td>'+this.smell+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td><b>Date</b>'+
							'</td>'+
							'<td>'+this.createdAt+
							'</td>'+
						'</tr>';

					if(this.image !== "#"){
						contentString = contentString + 
						'<tr>'+
								'<td>'+
								'</td>'+
								'<td><a href="'+this.image+'" target="_blank"><img src="'+this.image+'" width="200px"></a>'+
								'</td>'+
							'</tr>'+
						'</table>'+
						'</div>'+
						'</div>';
					}else{
						contentString = contentString + 
						'</table>'+
						'</div>'+
						'</div>';
					}

					infowindow.setContent(contentString);
					infowindow.open(map, this);
				});
			}
		},
		error: function (error) {
			console.log("Error: " + error.code + " " + error.message);
		}
	});
}