var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 13);
//map.locate({setView: true, maxZoom: 17});

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];
var kind_food = [];
var filter;

function onMapLoad() {
	let kind_temp = [];
	console.log("Mapa cargado");
	$.get("api/apiRestaurants.php",function(data){
		data_markers=JSON.parse(data);
		console.log(data_markers);
		for (var i = 0; i < data_markers.length; i++) {
			kind_temp =	data_markers[i].kind_food.split(",",3);
			for (var j = 0; j < kind_temp.length; j++) {
				if(kind_food.includes(kind_temp[j])){

				} else {
					kind_food.push(kind_temp[j])
				}
			}
		}
		for(var j=0; j< kind_food.length;j++){
			jQuery('<option/>', {
				value: kind_food[j],
				html: kind_food[j]
			}).appendTo('#kind_food_selector select');
		}
		console.log($( "#kind_food_selector option:selected").text());
		render_to_map(data_markers, 'all');

		$('#kind_food_selector').on('change', function() {
			console.log($(this).find(":selected").text());
			filter = $(this).find(":selected").text();
			render_to_map(data_markers, filter);
		});
	})};

	function render_to_map(data_markers,filter){
		markers.clearLayers();
		if (filter == "All") {
			for (var i = 0; i < data_markers.length; i++) {
				console.log(data_markers[i])
				var marker_temp = L.marker(new L.LatLng(data_markers[i].lat,data_markers[i].lng)).bindPopup(data_markers[i].Name + '<br> Type of food: ' + data_markers[i].kind_food).openPopup();
				markers.addLayer(marker_temp).addTo(map).openPopup();
			}} else {
				for (var i = 0; i < data_markers.length; i++) {
					if (data_markers[i].kind_food.includes(filter)) {
						console.log(data_markers[i])
						var marker_temp = L.marker(new L.LatLng(data_markers[i].lat,data_markers[i].lng)).bindPopup(data_markers[i].Name + '<br> Type of food: ' + data_markers[i].kind_food).openPopup();
						markers.addLayer(marker_temp).addTo(map).openPopup();
					}
				}
			};
		};
