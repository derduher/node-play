$(function () {
	var mapOptions = {
		zoom: 2,
		center: new google.maps.LatLng(24.397, -120.644),
		mapTypeId: google.maps.MapTypeId.HYBRID
	}
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	var socket = io.connect('http://servermap.nimblerendition.com');
	socket.on('server', function (data) {
		console.log(data);
		for (var i = 0; i < data.length; i++) {
			var server = data[i];
			var location = new google.maps.LatLng(server.location.ll[0],server.location.ll[1]);
			var marker = new google.maps.Marker({
				position: location,
				map: map
			});
			marker.setTitle(server.host);
		}
	});
});
