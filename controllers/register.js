var crypto = require('crypto');
var vendorProvider = require('../models/vendor');
exports.index = function(req, res) {
	res.render('register', {
		title: 'Signup'
	})
}

exports.process = function(req, res) {
	/*
	 *	Email, password, display name, photo, description
	 */
	 req.assert('email', 'Email is required, give it another shot!').isEmail();
	 req.assert('password', 'Password is always required.').notEmpty();
	 req.assert('display_name', 'Pick a name that will be displayed to the world').notEmpty();
	 req.assert('description', 'Tell us a little bit about yourself').notEmpty();

	var errors = req.validationErrors();
	if(errors) {
		console.log(errors);
		res.send(errors, 500);
		return;
	} else {
		var email = req.param('email');
		var password = req.param('password');
		var display_name = req.param('display_name');
		var description = req.param('description');

		var tmp_path = req.files.picture.path;
		var target_path = '/uploads/users/';
   		var cryptName = crypto.createHash('md5').update(req.files.picture.name + new Date().getTime()).digest("hex");
    	var filename = cryptName + path.extname(req.files.picture.name);
    	target_path += filename;

    	//target_path now contains something like /uploads/users/12312381723180273.png
    	fs.rename(tmp_path, "public" + target_path, function(err) {
	        if (err) throw err;
	        vendorProvider.register(email, password, display_name, description, filename, function(err, result) {
	        	if(err) throw err;
	        	res.redirect("/vendor");
	        });
	    });
	}
}