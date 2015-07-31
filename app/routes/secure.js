module.exports = function(router, passport){

	router.use(function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect('/auth');
	});

	router.get('/profile', function(req, res){
		res.render('secured/profile.ejs', { user: req.user });
	});

	router.get('/home', function(req, res){
		res.render('secured/home.ejs', { user: req.user });
	});
	
	router.get('/main', function(req, res){
		res.render('secured/main.ejs', { user: req.user });
	});

	router.get('/*', function(req, res){
		res.redirect('/main');
	});

};