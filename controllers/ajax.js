exports.loggedIn = function(req, res) {
	if(req.session.user_id == undefined)
		res.send(500);
	else
	{
		var html = '<li><a id="checkout" href="#">Check Out</a></li>';
		html += '<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" ';
		html += 'id="checkin" href="#">Check In</a><div class="dropdown-menu" style="padding:15px;"></div></li>';
		html += '<li><a id="signout" href="/logout">Sign Out</a></li>';
		res.send(html);
	}
}