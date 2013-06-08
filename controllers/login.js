var loginProvider = require("../models/login");

exports.index = function(req, res) {
	res.render('login');
}

exports.process = function(req, res) {
	req.assert('email', 'Email is required, give it another shot!').isEmail();
	req.assert('password', 'Password is always required.').notEmpty();

	var errors = req.validationErrors();
	if(errors) {
		console.log(errors);
		res.send(errors, 500);
		return;
	} else {
		var email = req.param('email');
		var password = req.param('password');
		loginProvider.login(email, password, req, function(err, result) {
			if(err) throw err;
			if(result === true) {
				res.redirect("/vendor");
			}
			else {
				res.send([{msg:"Oops, that didn't work. Try again"}], 500);
			} 
		});
	}
}

exports.logout = function(req, res) {
	loginProvider.logout(req, function() {
		res.redirect('/');
	});
}