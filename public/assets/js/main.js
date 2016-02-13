function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : -34.397,
			lng : 150.644
		},
		zoom : 6
	});
	var marker;
	var infoWindow = new google.maps.InfoWindow({
		map : map
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

	google.maps.event.addListener(map, 'click', function(e) {
		if (marker) {
			marker.setPosition(e.latLng);
		} else {
			marker = new google.maps.Marker({
				position : e.latLng,
				animation : google.maps.Animation.BOUNCE,
				map : map,
				icon : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
			});
		}
		google.maps.event.addListener(marker, "click", function() {
			infoWindow.open(map, marker);
		});
	});
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow
			.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.'
					: 'Error: Your browser doesn\'t support geolocation.');
}

function initialize() {
	var mapProp = {
		center : new google.maps.LatLng(51.508742, -0.120850),
		zoom : 5,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map"), mapProp);
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

login = {
	submitCreateForm : function(form) {
		submitForm(form, 'login', function(data) {
			try {
				data = JSON.parse(data);
				console.log(data);
				if (data.code == 1) {
					$("#create-fail").hide();
					$("#create-success").show();
					$('#create-modal-translation').modal('hide');
					setTimeout(function() {
						$("#create-success").fadeOut(1000);
					}, 2000);
				} else if (data.code == 2) {
					$("#create-success").hide();
					$("#create-fail").html(data.message);
					$("#create-fail").fadeIn();
				}
			} catch (e) {
				$("#create-success").hide();
				$("#create-fail").html('Fail');
				$("#create-fail").show();
				console.log(data);
			}
		});
	}
};

$(document).ready(function() {
	initMap();
});