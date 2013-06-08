var lat = null;
var lon = null;
$(document).ready(function() {
	if(geoPosition.init()) {
		geoPosition.getCurrentPosition(success, error, {timeout: 10000, enableHighAccuracy: true});
	} else {
		error({code: 3});
	}
	function success(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		refresh();
		centerMap();
	}
	function error(err){ 
		lat = 37.507618;
		lon = 127.04510849999997;
		refresh();
		centerMap();
		if(err.code == 1) {
			//permission denied
		} else if(err.code == 2) {
			//position unavailble
		} else if(err.code == 3) {
			//timeout
		}
	}
});
var centerMap = function() {
	if($("#map_canvas").length != 0) {
		var origin = new google.maps.LatLng(lat, lon);
		$("#map_canvas").gmap('get','map').setOptions({'center':origin, 'zoom':15});
	}
}
$(document).ready(function() {
	if($("#map_canvas").length != 0)
		$("#pill-grid").removeClass("active");
	else if($("#pop_list").length != 0)
		$("#pill-grid").addClass("active")
			.find("a").attr("href", "/");
	centerMap();
});
var refresh = function() {
	if($("#map_canvas").length != 0)
		refreshMap();
	else if($("#pop_list").length != 0)
		refreshList();
}
var imgArray = {
	"shopping": "/images/vendors/shopping200x283.png",
	"food": "/images/vendors/food200x283.png",
	"party": "/images/vendors/party200x283.png",
	"music": "/images/vendors/music200x283.png",
	"exhibit": "/images/vendors/exhibit200x283.png",
}
var refreshList = function() {
	if(lat != null && lon != null) {
		var elements = $(".nav-pills > li.active");
		var activeTypes = $.map(elements,function(n,i) {
			return $(elements[i]).data("type");
		});
		var within = 10;
		var data = {
			types: activeTypes,
			within: within,
			lat: lat,
			lon: lon
		}
		var query = $.param(data);
		var endpoint = "/api/v1/points/list";

		$.get(endpoint + "?" + query).success(function(data) {
			$("#pop_list").html("");
			$.each(data, function(i, item) {
				if(i % 2 == 1)
					var html = "<div class='row-fluid'>";
				else
					var html = "<div>";
			 	html += '<li class="span6"> <div class="thumbnail">';
			 	html += "<h4>" + item.company_name + "</h4>";
                html += '<img src="'+imgArray[item.current_location.type]+'" alt="ALT NAME"> ';
			    if(item.current_location.description != null)
					html += "<p>" + item.current_location.description + "</p>";
				else
					html += "<p>" + item.description + "</p>";
			    html += "<p>Providing you with <b>" + item.current_location.type + "</b> until about <b>";
				html += new Date(Date.parse(item.current_location.expires)).toLocaleTimeString() + "</b></p>";
	
			    html += '</div></div></li></div>';          
   
  				$("#pop_list").append(html);
			});
		});
	} else {
		alert("No lat lon");
	}
}

var refreshMap = function() {
	var iconArray = {
		"shopping": "/images/markers/supermarket.png",
		"food": "/images/markers/bread.png",
		"party": "/images/markers/liquor.png",
		"music": "/images/markers/music.png",
		"exhibit": "/images/markers/publicart.png"
	}
	if(lat != null && lon != null) {
		var elements = $(".nav-pills > li.active");
		var activeTypes = $.map(elements,function(n,i) {
			return $(elements[i]).data("type");
		});
		var within = 10;
		var data = {
			types: activeTypes,
			within: within,
			lat: lat,
			lon: lon
		}
		var query = $.param(data);
		var endpoint = "/api/v1/points/list";

		$.get(endpoint + "?" + query).success(function(data) {
			$('#map_canvas').gmap('clear', 'markers');
			var $marker = $("#map_canvas").gmap('addMarker', {
				'position': lat + "," + lon
			});
			$.each(data, function(i, item) {
				var lat = item.current_location.point.coordinates[1];
				var lon = item.current_location.point.coordinates[0];
				var html = "<b>" + item.company_name + "</b>";
				html += "<div class='content'><img src='"+imgArray[item.current_location.type]+"'/></div>";
				if(item.current_location.description != null)
					html += "<p>" + item.current_location.description + "</p>";
				else
					html += "<p>" + item.description + "</p>";
				html += "<p>Providing you with <b>" + item.current_location.type + "</b> until about <b>";
				html += new Date(Date.parse(item.current_location.expires)).toLocaleTimeString() + "</b></p>";
				var $marker = $("#map_canvas").gmap('addMarker', {
					'position': lat + "," + lon,
					'icon': iconArray[item.current_location.type]
				});
				$marker.click(function() {
					$('#map_canvas').gmap('openInfoWindow', {'content': html}, this);
				});
			});
		});
	} else {
		alert("No lat lon");
	}
}
$(document).ready(function() {
	$(".nav-pills > li").click(function() {
		$(this).toggleClass("active");
		refresh();
	});
	$.get("/ajax/logged").success(function(html) {
		$("#signup").remove();
		$("#signin").parent().parent().html(html);
		$('.dropdown-toggle').dropdown();
		$("#checkin").click(function() {
			$.get("/checkin").success(function(html) {
				$(".dropdown-menu").html(html);
				$(".dropdown-menu form").submit(function(e) {
					var data = {
						lat: lat,
						lon: lon,
						type: $("#type").val(),
						hours: $("#hours").val()
					}
					if(data.type == 'x' || data.hours == 'x') {
						alert("Please set the event type and duration");
						return false;
					} else {
						var query = $.param(data);
						var endpoint = "/api/v1/vendor/checkIn";
						$.get(endpoint + "?" + query).success(function(d) {
							alert("This " + data.type + " event has popped up for " + data.hours + " hours!");
							$('.dropdown.open .dropdown-toggle').dropdown('toggle');
							refresh();
						});
						return false;
					}
				});
			});
		});
	}).error(function() {
		$("#signup").removeClass("hidden");
		$("#signin").removeClass("hidden");
	});
	$("#register-form").submit(function(e) {
		e.preventDefault(); //prevent submit
		$(".control-group").removeClass("error");
		$(".help-inline").remove();
		var action = $(this).attr("action");
		var data = $(this).serialize();
		$.post(action, data).success(function(res) {
			//Do successful things
			window.location.href = "/vendor";
		}).error(function(data) {
			var errors = JSON.parse(data.responseText);
			$.each(errors, function(index, item) {
				$("#" + item.param).parent()
				.append("<span class='help-inline'>" + item.msg + "</span>")
				.parents(".control-group").addClass("error")
			});
		});
		return false;
	});

	$('.dropdown-toggle').dropdown();
	$("#signin").click(function() {
		$.get("/login").success(function(html) {
			$(".dropdown-menu").html(html);
		});
	});
	$('body').on('click', '.dropdown-menu form', function (e) {
		e.stopPropagation();
	});
	$('.dropdown-menu').on('submit', 'form', function(e) {
		var action = $(this).attr("action");
		var data = $(this).serialize();
		$.post(action, data).success(function(res) {
			//Do successful things
			window.location.href = "/vendor";
		}).error(function(data) {
			var errors = JSON.parse(data.responseText);
			$.each(errors, function(index, item) {
				$("#" + item.param)
				.before("<span class='text-error'>" + item.msg + "</span>")
				.parents(".control-group").addClass("error")
			});
		});
		e.stopPropagation();
		return false;
	});
});

/*
 * Map Functions
 */ 
$(document).ready(function() {
	var options = {
		center: new google.maps.LatLng(36.80358081325186, 126.93521976470947),
		zoom: 17
	};
	$('#map_canvas').gmap(options).bind('init', function(ev, map) {
		var canvas = $("#map_canvas");
		google.maps.event.addListener(map, 'click', function(event){
			var lat = event.latLng.lat();
			var lon = event.latLng.lng();
			var distance = $("#dis").val();
			var data = "lat=" + lat + "&lon=" + lon + "&dis=" + distance;
			window.lat = lat;
			window.lon = lon;
			console.log("change");
			/*$.post('/api/points/query', data)
			.success(function(res) {
				canvas.gmap('clear', 'markers');
				$.each(res, function(index, item) {
					var lat = item.loc.coordinates[1];
					var lon = item.loc.coordinates[0];
					var pos = lat + ',' + lon;
					var $marker = canvas.gmap('addMarker', {'position': pos});
				});
			});*/
		});
	});
	$(window).resize(function() {
		resizeMap();
	});
	function resizeMap() {
		if($(".nav-pills").length != 0) {
			var bottomNavPills = $(".nav-pills").position().top + $(".nav-pills").height() + 1;
			$("#map_canvas").height($(this).height() - bottomNavPills);
		}
	}
	resizeMap();
});


