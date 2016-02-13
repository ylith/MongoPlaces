function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : -34.397,
			lng : 150.644
		},
		zoom : 15
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
			infoWindow.setContent('You are here!');
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

function setMessage(data) {
	var messageElement = $("#status-message");
	var result = data.result;
	try {
		messageElement.show();
		if (result.status == 1) {
			messageElement.attr('class', 'alert alert-success');
		} else if (result.status == 2) {
			messageElement.attr('class', 'alert alert-danger');
		} else if (result.status == 3) {
			messageElement.attr('class', 'alert alert-warning');
		} else if (result.status == 4) {
			messageElement.attr('class', 'alert alert-info');
		}
	} catch (e) {
		messageElement.attr('class', 'alert alert-danger');
	}
	messageElement.find("strong").html(result.message);
	messageElement.fadeTo(2000, 500).slideUp(500, function() {
		messageElement.hide();
	});
}

function submitForm(form, url, callback, type, error) {
	type = type || 'POST';
	error = error || function(xhr, ajaxOptions, thrownError) {
		console.log(xhr.status + thrownError + xhr.responseText);
	}
	callback = callback || setMessage;

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
		submitForm(form, 'addNewObject');
	}
};

login = {
	submitCreateForm : function(form) {
		submitForm(form, 'login', function(data) {
			setMessage(data);
			if (data.result.status == 1) {
				console.log(213123);
				location.reload();
			}
		});
	}
};

register = {
	submitCreateForm : function(form) {
		submitForm(form, 'register', function(data) {
			setMessage(data);
			if (data.result.status == 1) {
				location.reload();
			}
		});
	}
};

$(document).ready(function() {
	initMap();

	$('#login-form-link').click(function(e) {
		$("#login-form-container").delay(100).fadeIn(100);
		$("#register-form-container").fadeOut(100);
		$('#register-form-link').removeClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form-container").delay(100).fadeIn(100);
		$("#login-form-container").fadeOut(100);
		$('#login-form-link').removeClass('active');
		e.preventDefault();
	});
	$('[data-toggle="tooltip"]').tooltip();
});