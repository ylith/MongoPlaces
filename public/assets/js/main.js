var currentInfoWindow;
var currentMarker;
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : -34.397,
			lng : 150.644
		},
		zoom : 15
	});
	currentInfoWindow = new google.maps.InfoWindow({
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

			currentInfoWindow.setPosition(pos);
			currentInfoWindow.setContent('You are here!');
			map.setCenter(pos);
		}, function() {
			handleLocationError(true, currentInfoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, currentInfoWindow, map.getCenter());
	}

	google.maps.event
			.addListener(
					map,
					'click',
					function(e) {
						if (currentMarker) {
							currentMarker
									.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
							currentMarker.setPosition(e.latLng);
						} else {
							currentMarker = new google.maps.Marker(
									{
										position : e.latLng,
										animation : google.maps.Animation.BOUNCE,
										map : map,
										title : 'cmon',
										icon : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
									});
						}
						var html = "";
						html += "<div class=\"addObject-container\" id=\"addObject-container\">";
						html += "	<h3>Add new point of interest<\/h3>";
						html += "	<br>";
						html += "	<form class=\"form-horizontal\" role=\"form\" method=\"POST\"";
						html += "		id=\"addObject-form\"";
						html += "		onsubmit=\"mapObject.submitCreateForm(this); return false;\">";
						html += "		<div class=\"form-group\">";
						html += "			<label for=\"name\" class=\"col-sm-4 control-label\">Name: <\/label>";
						html += "			<div class=\"col-sm-8\">";
						html += "				<input type=\"text\" class=\"form-control\" name=\"name\" required\/>";
						html += "			<\/div>";
						html += "		<\/div>";
						html += "		<br>";
						html += "		<div class=\"form-group\">";
						html += "			<label for=\"description\" class=\"col-sm-4 control-label\">Description:";
						html += "			<\/label>";
						html += "			<div class=\"col-sm-8\">";
						html += "				<textarea rows=\"3\" class=\"form-control\" name=\"description\"><\/textarea>";
						html += "			<\/div>";
						html += "		<\/div>";
						html += "		<hr>";
						html += "		<div class=\"form-group\">";
						html += "			<label for=\"type\" class=\"col-sm-4 control-label fleft\">Type: <\/label>";
						html += "			<div class=\"well\">";
						html += "				<div class=\"btn-group\" data-toggle=\"buttons\">";
						html += "					<div class=\"btn\">";
						html += "						<div class=\"sprite restaurant active\" data-toggle=\"tooltip\"";
						html += "							title=\"Food\">";
						html += "							<input type=\"radio\" class=\"hidden\" name=\"type\" value=\"1\"";
						html += "								autocomplete=\"off\" checked> <span class=\"glyphicon glyphicon-ok\"><\/span>";
						html += "						<\/div>";
						html += "					<\/div>";
						html += "					<div class=\"btn\">";
						html += "						<div class=\"sprite grocery\" data-toggle=\"tooltip\" title=\"Store\">";
						html += "							<input type=\"radio\" class=\"hidden\" name=\"type\" value=\"2\"";
						html += "								autocomplete=\"off\"> <span class=\"glyphicon glyphicon-ok\"><\/span>";
						html += "						<\/div>";
						html += "					<\/div>";
						html += "					<div class=\"btn\">";
						html += "						<div class=\"sprite lodging-2\" data-toggle=\"tooltip\" title=\"Hotel\">";
						html += "							<input type=\"radio\" class=\"hidden\" name=\"type\" value=\"3\"";
						html += "								autocomplete=\"off\"> <span class=\"glyphicon glyphicon-ok\"><\/span>";
						html += "						<\/div>";
						html += "					<\/div>";
						html += "					<div class=\"btn\">";
						html += "						<div class=\"sprite university\" data-toggle=\"tooltip\"";
						html += "							title=\"Education\">";
						html += "							<input type=\"radio\" class=\"hidden\" name=\"type\" value=\"4\"";
						html += "								autocomplete=\"off\"> <span class=\"glyphicon glyphicon-ok\"><\/span>";
						html += "						<\/div>";
						html += "					<\/div>";
						html += "					<div class=\"btn\">";
						html += "						<div class=\"sprite theater\" data-toggle=\"tooltip\" title=\"Culture\">";
						html += "							<input type=\"radio\" class=\"hidden\" name=\"type\" value=\"5\"";
						html += "								autocomplete=\"off\"> <span class=\"glyphicon glyphicon-ok\"><\/span>";
						html += "						<\/div>";
						html += "					<\/div>";
						html += "					<div class=\"btn\">";
						html += "						<div class=\"sprite stadium\" data-toggle=\"tooltip\" title=\"Sports\">";
						html += "							<input type=\"radio\" class=\"hidden\" name=\"type\" value=\"6\"";
						html += "								autocomplete=\"off\"> <span class=\"glyphicon glyphicon-ok\"><\/span>";
						html += "						<\/div>";
						html += "					<\/div>";
						html += "					<div class=\"btn\">";
						html += "						<div class=\"sprite busstop\" data-toggle=\"tooltip\"";
						html += "							title=\"Public Transport\">";
						html += "							<input type=\"radio\" class=\"hidden\" name=\"type\" value=\"7\"";
						html += "								autocomplete=\"off\"> <span class=\"glyphicon glyphicon-ok\"><\/span>";
						html += "						<\/div>";
						html += "					<\/div>";
						html += "					<div class=\"btn\">";
						html += "						<div class=\"sprite administration\" data-toggle=\"tooltip\"";
						html += "							title=\"Administration\">";
						html += "							<input type=\"radio\" class=\"hidden\" name=\"type\" value=\"8\"";
						html += "								autocomplete=\"off\"> <span class=\"glyphicon glyphicon-ok\"><\/span>";
						html += "						<\/div>";
						html += "					<\/div>";
						html += "					<div class=\"btn\">";
						html += "						<div class=\"sprite tree\" data-toggle=\"tooltip\" title=\"Nature\">";
						html += "							<input type=\"radio\" name=\"type\" value=\"9\" data-toggle=\"tooltip\"";
						html += "								title=\"restaurant\" autocomplete=\"off\" checked> <span";
						html += "								class=\"glyphicon glyphicon-ok\"><\/span>";
						html += "						<\/div>";
						html += "					<\/div>";
						html += "				<\/div>";
						html += "			<\/div>";
						html += "		<\/div>";
						html += "		<hr>";
						html += "		<br>";
						html += "		<div class=\"form-group\">";
						html += "			<label for=\"priceRange\" class=\"col-sm-4 control-label\">Price Range: <\/label>";
						html += "			<div class=\"col-sm-4\">";
						html += "				<input type=\"number\" class=\"form-control\" name=\"priceRange[min]\"";
						html += "					value=\"0\" \/>";
						html += "			<\/div>";
						html += "			<div class=\"col-sm-4\">";
						html += "				<input type=\"number\" class=\"form-control\" name=\"priceRange[max]\"";
						html += "					value=\"0\" \/>";
						html += "			<\/div>";
						html += "		<\/div>"
								+ '<input type="hidden" class="form-control" name="lat" value="'
								+ currentMarker.getPosition().lat()
								+ '"/>'
								+ '<input type="hidden" class="form-control" name="lng" value="'
								+ currentMarker.getPosition().lng() + '"/>';
						html += "	<\/form>";
						html += "	<hr>";
						html += "	<button type=\"button\" class=\"btn btn-primary\"";
						html += "		onclick=\"$('#addObject-form').submit()\">Save<\/button>";
						html += "<\/div>"
						currentInfoWindow.setContent(html);
						currentInfoWindow.open(map, currentMarker);
						google.maps.event.addListener(currentMarker, "click",
								function() {
									currentInfoWindow.open(map, currentMarker);
									currentInfoWindow
											.setContent(currentMarker.title);
								});
					});
}

function renderMarkers(markers, map) {
	if (markers) {
		$
				.each(
						markers,
						function(index, m) {
							var latlng = new google.maps.LatLng(
									m.location.coordinates[0],
									m.location.coordinates[1]);
							var marker = new google.maps.Marker(
									{
										position : latlng,
										map : map,
										title : m.name,
										icon : m.image
												|| 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
									});
							marker.info = new google.maps.InfoWindow({
								content : marker.title,
								position : marker.position
							});
							google.maps.event.addListener(marker, "click",
									function() {
										marker.info.open(map, marker);
									});
						});
	}
}

function handleLocationError(browserHasGeolocation, currentInfoWindow, pos) {
	currentInfoWindow.setPosition(pos);
	currentInfoWindow
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
		submitForm(
				form,
				'addNewObject',
				function(data) {
					setMessage(data);
					if (data.result.status == 1) {
						currentInfoWindow.close();
						currentMarker.setAnimation();
						currentMarker
								.setIcon(data.result.element.image
										|| 'http://maps.google.com/mapfiles/ms/icons/red-dot.png');
					}
				});
	}
};

login = {
	submitCreateForm : function(form) {
		submitForm(form, 'login', function(data) {
			setMessage(data);
			if (data.result.status == 1) {
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