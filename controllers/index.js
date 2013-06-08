
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

/*
 * GET home page.
 */

exports.list = function(req, res){
  res.render('index', {
  	nomap: true
  });
};