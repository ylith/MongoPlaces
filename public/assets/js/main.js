var currentInfoWindow;
var currentMarker;
var map;
var markers = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
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

	google.maps.event.addListener(map, 'click', createNewMarker);
}

function createNewMarker(e) {
	if (currentMarker) {
		currentMarker
				.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
		currentMarker.setPosition(e.latLng);
	} else {
		currentMarker = new google.maps.Marker({
			position : e.latLng,
			animation : google.maps.Animation.BOUNCE,
			map : map,
			icon : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
		});
	}
	var html = "";
	html += "<div class=\"addObject-container custom-iw\" id=\"addObject-container\">";
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
	html += "					 \/>";
	html += "			<\/div>";
	html += "			<div class=\"col-sm-4\">";
	html += "				<input type=\"number\" class=\"form-control\" name=\"priceRange[max]\"";
	html += "					 \/>";
	html += "			<\/div>";
	html += "		<\/div>";
	html += "		<div class=\"form-group\">";
	html += "			<label for=\"opened\" class=\"col-sm-4 control-label\">Working Hours: <\/label>";
	html += "			<div class=\"col-sm-4\">";
	html += "				<input type=\"number\" class=\"form-control\" name=\"opened[from]\"";
	html += "					 \/>";
	html += "			<\/div>";
	html += "			<div class=\"col-sm-4\">";
	html += "				<input type=\"number\" class=\"form-control\" name=\"opened[until]\"";
	html += "					 \/>";
	html += "			<\/div>";
	html += "		<\/div>"
			+ '<input type="hidden" class="form-control" name="lat" value="'
			+ currentMarker.getPosition().lat() + '"/>'
			+ '<input type="hidden" class="form-control" name="lng" value="'
			+ currentMarker.getPosition().lng() + '"/>';
	html += "	<\/form>";
	html += "	<hr>";
	html += "	<button type=\"button\" class=\"btn btn-primary\"";
	html += "		onclick=\"$('#addObject-form').submit()\">Save<\/button>";
	html += "<\/div>";
	currentInfoWindow.setContent(html);
	currentInfoWindow.open(map, currentMarker);
	google.maps.event.addListener(currentMarker, "click", function() {
		currentInfoWindow.open(map, currentMarker);
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
								position : marker.position
							});
							markers.push(marker);
							addMarkerInfo(m, marker.info);
							google.maps.event
									.addListener(
											marker,
											"click",
											function() {
												markers.forEach(function(m) {
													if (m.info) {
														m.info.close();
													}
												});
												marker.info.open(map, marker);
												var _id = $('#custom-iw').attr(
														'data-objectId');
												$('#filter-type')
														.click(
																function(e) {
																	$
																			.ajax({
																				type : 'POST',
																				cache : false,
																				url : 'filter',
																				data : {
																					type : $(
																							'#filter-type')
																							.attr(
																									'data-type'),
																					_id : _id
																				},
																				success : function(
																						result) {
																					return addFilterResult(result);
																				}
																			});
																	e
																			.preventDefault();
																});

												$('#filter-nearest')
														.click(
																function(e) {
																	$
																			.ajax({
																				type : 'POST',
																				cache : false,
																				url : 'filter',
																				data : {
																					nearest : true,
																					_id : _id
																				},
																				success : function(
																						result) {
																					return addFilterResult(result);
																				}
																			});
																	e
																			.preventDefault();
																});
												$('#filter-like')
														.click(
																function(e) {
																	$
																			.ajax({
																				type : 'POST',
																				cache : false,
																				url : 'filter',
																				data : {
																					like : true,
																					_id : _id
																				},
																				success : function(
																						result) {
																					return addFilterResult(result);
																				}
																			});
																	e
																			.preventDefault();
																});
												$('#addToFavourites')
														.click(
																function(e) {
																	$
																			.ajax({
																				type : 'POST',
																				cache : false,
																				url : 'favourite',
																				data : {
																					_id : _id
																				}
																			});
																	e
																			.preventDefault();
																});
											});
						});
	}
}

function addMarkerInfo(m, markerInfo) {
	var html = "";
	var description = '';
	var image = '<div class="sprite restaurant" data-toggle="tooltip" title="Hotel"><\/div>';
	if (m.description) {
		description = m.description;
	}
	console.log();
	switch (m.type) {
	case 1:
		image = '<div class="sprite restaurant fright" data-toggle="tooltip" title="Hotel"><\/div>';
		break;
	case 2:
		image = '<div class="sprite grocery fright" data-toggle="tooltip" title="Hotel"><\/div>';
		break;
	case 3:
		image = '<div class="sprite lodging-2 fright" data-toggle="tooltip" title="Hotel"><\/div>';
		break;
	case 4:
		image = '<div class="sprite university fright" data-toggle="tooltip" title="Hotel"><\/div>';
		break;
	case 5:
		image = '<div class="sprite theater fright" data-toggle="tooltip" title="Hotel"><\/div>';
		break;
	case 6:
		image = '<div class="sprite stadium fright" data-toggle="tooltip" title="Hotel"><\/div>';
		break;
	case 7:
		image = '<div class="sprite busstop fright" data-toggle="tooltip" title="Hotel"><\/div>';
		break;
	case 8:
		image = '<div class="sprite administration fright" data-toggle="tooltip" title="Hotel"><\/div>';
		break;
	case 9:
		image = '<div class="sprite tree fright" data-toggle="tooltip" title="Hotel"><\/div>';
		break;
	}

	html += "<div id=\"custom-iw\" data-objectId=\"" + m._id + "\">";
	html += "	<div class=\"iw-title\">" + m.name + "<\/div>";
	html += "	<div class=\"iw-content\">";
	html += "		<div class=\"iw-subTitle\">Description<\/div>";
	html += image;
	html += "		<p>" + description + "<\/p>";
	if (m.opened) {
		html += "		<p>Opened from " + m.opened.from + " to " + m.opened.until
				+ "<\/p>";
	}
	html += "		<div class=\"iw-subTitle\">Coordinates<\/div>";
	html += "		<p>" + formatNum(m.location.coordinates[0]) + ' : '
			+ formatNum(m.location.coordinates[1]) + "<\/p>";
	html += "		<div class=\"iw-subTitle\">Filters<\/div>";
	html += "		<a href=\"#\" id=\"filter-type\" data-type=\"" + m.type
			+ "\">Others of type<\/a> | ";
	html += "		<a href=\"#\" id=\"filter-nearest\">Nearest 5<\/a> | ";
	html += "		<a href=\"#\" id=\"filter-like\">Others Like<\/a>";
	html += "		<hr>";
	html += "		<a href=\"#\" id=\"addToFavourites\">Add to favourites<\/a>";
	html += "		<div id=\"iw-filter-result\"><\/div>";
	html += "	<\/div>";
	html += "	<div class=\"iw-bottom-gradient\"><\/div>";
	html += "<\/div>";
	markerInfo.setContent(html);
}
function addFilterResult(result) {
	result = result.result;
	var div = $('#iw-filter-result');
	div.empty();
	if (result) {
		$
				.each(
						result,
						function(index, data) {
							console.log();
							var x = data.location.coordinates[0], y = data.location.coordinates[1];
							div.append('<div class="mapLink" data-x="' + x
									+ '"' + ' data-y="' + y + '">' + data.name
									+ ' : ' + '(' + formatNum(x) + ','
									+ formatNum(y) + ')</div>');
							$('#iw-filter-result .mapLink').click(function(e) {
								var latlng = new google.maps.LatLng(x, y);
								map.panTo(latlng);
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

function formatNum(num3) {
	return parseFloat(Math.round(num3 * 100) / 100).toFixed(2);
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
						currentMarker.info = new google.maps.InfoWindow({
							position : currentMarker.position
						});
						currentInfoWindow.setContent();
						addMarkerInfo(data.result.element, currentInfoWindow);
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
	$('#login-form-link').click(function(e) {
		$("#login-form-container").delay(100).fadeIn(100);
		$("#register-form-container").fadeOut(100);
		$('#register-form-link').removeClass('active');
		e.preventDefault();
	});
	$('[data-toggle="tooltip"]').tooltip();
});