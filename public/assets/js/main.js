function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : -34.397,
			lng : 150.644
		},
		zoom : 6
	});
	var currentMarker;
	var infoWindow = new google.maps.InfoWindow({
		map : map
	});
	var pointsOfInterest = {};
	$.ajax({
		type : 'GET',
		url : 'map',
		success : function(data) {
			pointsOfInterest = data.result;
			renderMarkers(pointsOfInterest, map);
		}
	});

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat : position.coords.latitude,
				lng : position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	google.maps.event
			.addListener(
					map,
					'click',
					function(e) {
						if (currentMarker) {
							currentMarker.setPosition(e.latLng);
							var html = '<div class="addObject-container" id="addObject-container">'
									+ '<h3>Add new point of interest</h3><br>'
									+ '<form role="form" method="POST" id="addObject-form" onsubmit="mapObject.submitCreateForm(this); return false;">'
									+ '<div class="form-group">'
									+ '<label for="name" class="col-sm-4 control-label">Name </label>'
									+ '<div class="col-sm-8">'
									+ '<input type="text" class="form-control" name="name"/>'
									+ '</div>'
									+ '</div>'
									+ '</br>'
									+ '<div class="form-group">'
									+ '<label for="description" class="col-sm-4 control-label">Description </label>'
									+ '<div class="col-sm-8">'
									+ '<input type="text" class="form-control" name="description"/>'
									+ '<input type="hidden" class="form-control" name="lat" value="'
									+ currentMarker.getPosition().lat()
									+ '"/>'
									+ '<input type="hidden" class="form-control" name="lng" value="'
									+ currentMarker.getPosition().lng()
									+ '"/>'
									+ '</div></div></form><hr>'
									+ '<button type="button" class="btn btn-primary" onclick="$(\'#addObject-form\').submit()">Save</button></div>';
							infoWindow.setContent(html);
							infoWindow.open(map, currentMarker);
						} else {
							currentMarker = new google.maps.Marker(
									{
										position : e.latLng,
										animation : google.maps.Animation.BOUNCE,
										map : map,
										title : 'cmon',
										icon : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
									});
							var html = '<div class="addObject-container" id="addObject-container">'
									+ '<h3>Add new point of interest</h3><br>'
									+ '<form role="form" method="POST" id="addObject-form" onsubmit="mapObject.submitCreateForm(this); return false;">'
									+ '<div class="form-group">'
									+ '<label for="name" class="col-sm-4 control-label">Name </label>'
									+ '<div class="col-sm-8">'
									+ '<input type="text" class="form-control" name="name"/>'
									+ '</div>'
									+ '</div>'
									+ '</br>'
									+ '<div class="form-group">'
									+ '<label for="description" class="col-sm-4 control-label">Description </label>'
									+ '<div class="col-sm-8">'
									+ '<input type="text" class="form-control" name="description"/>'
									+ '<input type="hidden" class="form-control" name="lat" value="'
									+ currentMarker.getPosition().lat()
									+ '"/>'
									+ '<input type="hidden" class="form-control" name="lng" value="'
									+ currentMarker.getPosition().lng()
									+ '"/>'
									+ '</div></div></form><hr>'
									+ '<button type="button" class="btn btn-primary" onclick="$(\'#addObject-form\').submit()">Save</button></div>';
							infoWindow.setContent(html);
							infoWindow.open(map, currentMarker);
						}
						google.maps.event.addListener(currentMarker, "click",
								function() {
									infoWindow.open(map, currentMarker);
									infoWindow.setContent(currentMarker.title);
								});
					});
}

function renderMarkers(markers, map) {
	if (markers) {
		$.each(markers, function(index, m) {
			var latlng = new google.maps.LatLng(m.location.coordinates[0],
					m.location.coordinates[1]);
			var marker = new google.maps.Marker({
				position : latlng,
				map : map,
				title : m.name,
				icon : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
			});
			marker.info = new google.maps.InfoWindow({
				map : map,
				content : marker.title
			});
			google.maps.event.addListener(marker, "click", function() {
				marker.info.open(map, marker);
			});
		});
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow
			.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.'
					: 'Error: Your browser doesn\'t support geolocation.');
}

function submitForm(form, url, callback, type, error) {
	type = type || 'POST';
	error = error || function(xhr, ajaxOptions, thrownError) {
		console.log(xhr.status + thrownError + xhr.responseText);
	}

	$.ajax({
		type : type,
		cache : false,
		url : url,
		data : $(form).serialize(),
		success : callback,
		error : error
	});
}

mapObject = {
	submitCreateForm : function(form) {
		submitForm(form, 'addNewObject', function(data) {
			try {
				data = JSON.parse(data);
				if (data.result == 1) {
					$("#create-fail").hide();
					$("#create-success").show();
					$('#login-modal').modal('hide');
					setTimeout(function() {
						$("#create-success").fadeOut(1000);
					}, 2000);
				} else if (data.result == 2) {
					$("#create-success").hide();
					$("#create-fail").html(data.message);
					$("#create-fail").fadeIn();
				}
			} catch (e) {
				$("#create-success").hide();
				$("#create-fail").html('An error occured.');
				$("#create-fail").show();
				console.log(data);
			}
		});
	}
};

login = {
	submitCreateForm : function(form) {
		submitForm(form, 'register', function(data) {
			try {
				data = JSON.parse(data);
				if (data.result == 1) {
					$("#create-fail").hide();
					$("#create-success").show();
					$('#login-modal').modal('hide');
					setTimeout(function() {
						$("#create-success").fadeOut(1000);
					}, 2000);
				} else if (data.result == 2) {
					$("#create-success").hide();
					$("#create-fail").html(data.message);
					$("#create-fail").fadeIn();
				}
			} catch (e) {
				$("#create-success").hide();
				$("#create-fail").html('An error occured.');
				$("#create-fail").show();
				console.log(data);
			}
		});
	}
};

$(document).ready(function() {
	initMap();
});