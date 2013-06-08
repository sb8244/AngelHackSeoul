$(document).ready(function() {
	$("#register-form").submit(function(e) {
		e.preventDefault(); //prevent submit
		$(".control-group").removeClass("error");
		$(".help-inline").remove();
		var action = $(this).attr("action");
		var data = $(this).serialize();
		$.post(action, data).success(function(res) {
			//Do successful things
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
});