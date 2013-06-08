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
	}
	function error(err){ 
		lat = 37.507618;
		lon = 127.04510849999997;
		refresh();
		if(err.code == 1) {
			//permission denied
		} else if(err.code == 2) {
			//position unavailble
		} else if(err.code == 3) {
			//timeout
		}
	}
});
var refresh = function() {
	if($("#map_canvas").length != 0)
			refreshMap();
	else if($("#pop_list").length != 0)
		refreshList();
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
			$('#map_canvas').gmap('clear', 'markers');
			$.each(data, function(i, item) {
				 var html = '<li class="span2"> <div class="thumbnail">';
                     html += '<img src="http://placehold.it/200x283" alt="ALT NAME"> ';
				     html += '<p>' +item.company_name+'</p>';
				     if(item.current_location.description != null)
                         html += "<div>" + item.current_location.description + "</div>";
				     html += '<p>' + item.current_location.type + '</p> ';
				     html += '</div></div></li> ';          
   
   $("#pop_list").append(html)

			});
		});
	} else {
		alert("No lat lon");
	}
}
var refreshMap = function() {
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
			$.each(data, function(i, item) {
				var lat = item.current_location.point.coordinates[1];
				var lon = item.current_location.point.coordinates[0];
				var html = "<b>" + item.company_name + "</b>";
				if(item.pictures.length > 0)
					html += "<div class='content'><img src='/images/vendors/"+item.pictures[0]+"'/></div>";
				if(item.current_location.description != null)
					html += "<div>" + item.current_location.description + "</div>";
				else
					html += "<div>" + item.description + "</div>";
				html += "<div>Providing you with <b>" + item.current_location.type + "</b> until about <b>";
				html += new Date(Date.parse(item.current_location.expires)).toLocaleTimeString() + "</b></div>";
				var $marker = $("#map_canvas").gmap('addMarker', {'position': lat + "," + lon});
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
		zoom: 8
	};
	$('#map_canvas').gmap(options).bind('init', function(ev, map) {
		var canvas = $("#map_canvas");
		google.maps.event.addListener(map, 'click', function(event){
			var lat = event.latLng.lat();
			var lon = event.latLng.lng();
			var distance = $("#dis").val();
			var data = "lat=" + lat + "&lon=" + lon + "&dis=" + distance;

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


