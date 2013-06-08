exports.loggedIn = function(req, res) {
	if(req.session.user_id == undefined)
		res.send(500);
	else
		res.send('<a id="signout" href="/logout">Sign Out</a>');
}