$(document).ready(function() {
	if(geoPosition.init()) {
		geoPosition.getCurrentPosition(success, error, {timeout: 10000, enableHighAccuracy: true});
	} else {
		error({code: 3});
	}
	function success(position) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var latlng = new google.maps.LatLng(lat, lon);
		self.get('map').panTo(latlng);
		self.refresh();
		var $marker = $("#map").gmap('addMarker', {'position': lat + "," + lon})
	}
	function error(err){ 
		alert(err.code);
		if(err.code == 1) {
			//permission denied
		} else if(err.code == 2) {
			//position unavailble
		} else if(err.code == 3) {
			//timeout
		}
	}
});

$(document).ready(function() {
	$(".nav-pills > li").click(function() {
		$(this).toggleClass("active");
		var elements = $(".nav-pills > li.active");
		var activeTypes = $.map(elements,function(n,i) {
			return $(elements[i]).data("type");
		});
		
	});
	$.get("/ajax/logged").success(function(html) {
		$("#signup").remove();
		$("#signin").parent().html(html);
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
	$('.dropdown-menu').on('click', 'form', function (e) {
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
		var bottomNavPills = $(".nav-pills").position().top + $(".nav-pills").height() + 1;
		$("#map_canvas").height($(this).height() - bottomNavPills);
	}
	resizeMap();
});