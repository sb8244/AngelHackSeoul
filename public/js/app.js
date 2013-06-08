
$(document).ready(function() {
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