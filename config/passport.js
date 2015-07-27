var LocalStrategy = require("passport-local").Strategy;

var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var VkontakteStrategy = require("passport-vkontakte").Strategy;

var User = require("../app/models/user");
var configAuth = require("./auth");

module.exports = function(passport){
    
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });
    
    passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.username': email}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'That email already taken'));
				} 
				if(!req.user) {
					var newUser = new User();
					newUser.local.username = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
					
				} else {
					var user = req.user;
					user.local.username = email;
					user.local.password = user.generateHash(password);

					user.save(function(err){
						if(err)
							throw err;
						return done(null, user);
					})
				}
			})

		});
	}));
	
	
    passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({ 'local.username': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(!user.validPassword(password)){
						return done(null, false, req.flash('loginMessage', 'invalid password'));
					}
					return done(null, user);

				});
			});
		}
	));
  
    passport.use(new FacebookStrategy({
        clientID:       configAuth.facebookAuth.clientID,
        clientSecret:   configAuth.facebookAuth.clientSecret,
        callbackURL:    configAuth.facebookAuth.callbackURL,
        passReqToCallback: true,
        profileFields: ["emails", "displayName", "gender", "name", "profileUrl"]
      },
      function(req, accessToken, refreshToken, profile, done) {
            process.nextTick(function(){
                //user is not logged in yet
	    		if(!req.user){
                    User.findOne({'facebook.id': profile.id}, function(err, user){
                    if(err)
                        return done(err);
                    if(user)
                        return done(null, user);
                    else {
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.email = profile.emails[0].value;
                        newUser.facebook.name.firstName = profile.name.givenName;
                        newUser.facebook.name.lastName = profile.name.familyName;
                        newUser.facebook.gender = profile.gender;
                        newUser.facebook.profileUrl = profile.profileUrl;

                        newUser.save(function(err){
                           if(err)
		    						throw err;
		    					return done(null, newUser);
		    				});
		    				console.log(profile);
		    			}
		    		});
	    		}

	    		//user is logged in already, and needs to be merged
	    		else {
	    			var user = req.user;
	    			    user.facebook.id = profile.id;
                        user.facebook.token = accessToken;
                        user.facebook.email = profile.emails[0].value;
                        user.facebook.name.firstName = profile.name.givenName;
                        user.facebook.name.lastName = profile.name.familyName;
                        user.facebook.gender = profile.gender;
                        user.facebook.profileUrl = profile.profileUrl;

	    			user.save(function(err){
	    				if(err)
	    					throw err
	    				return done(null, user);
	    			})
	    			console.log(profile);
	    		}
	    		
	    	});
	    }

	));
    
     passport.use(new GoogleStrategy({
        clientID:       configAuth.googleAuth.clientID,
        clientSecret:   configAuth.googleAuth.clientSecret,
        callbackURL:    configAuth.googleAuth.callbackURL,
        passReqToCallback: true
      },
      function( req, accessToken, refreshToken, profile, done) {
           process.nextTick(function(){

	    		if(!req.user){
	    			User.findOne({'google.id': profile.id}, function(err, user){
		    			if(err)
		    				return done(err);
		    			if(user)
		    				return done(null, user);
		    			else {
		    				var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = accessToken;
                        newUser.google.email = profile.emails[0].value;
                        newUser.google.name.firstName = profile.name.givenName;
                        newUser.google.name.lastName = profile.name.familyName;
                        newUser.google.gender = profile.gender;
                        

                        newUser.save(function(err){
                            if(err)
		    						throw err;
		    					return done(null, newUser);
		    				})
		    				console.log(profile);
		    			}
		    		});
	    		} else {
	    			var user = req.user;
	    			    user.google.id = profile.id;
                        user.google.token = accessToken;
                        user.google.email = profile.emails[0].value;
                        user.google.name.firstName = profile.name.givenName;
                        user.google.name.lastName = profile.name.familyName;
                        user.google.gender = profile.gender;

					user.save(function(err){
						if(err)
							throw err;
						return done(null, user);
					});
					console.log(profile);
	    		}
	    		
	    	});
	    }

	));
    
    passport.use(new VkontakteStrategy({
        clientID:       configAuth.vkontakteAuth.clientID,
        clientSecret:   configAuth.vkontakteAuth.clientSecret,
        callbackURL:    configAuth.vkontakteAuth.callbackURL,
        profileFields: ["email"],
        passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
            process.nextTick(function(){

	    		if(!req.user){
	    			User.findOne({'vkontakte.id': profile.id}, function(err, user){
		    			if(err)
		    				return done(err);
		    			if(user)
		    				return done(null, user);
		    			else {
		    				var newUser = new User();
                        newUser.vkontakte.id = profile.id;
                        newUser.vkontakte.username = profile.username;
                        newUser.vkontakte.token = accessToken;
                        newUser.vkontakte.name.firstName = profile.name.givenName;
                        newUser.vkontakte.name.lastName = profile.name.familyName;
                        newUser.vkontakte.gender = profile.gender;
                        newUser.vkontakte.profileUrl = profile.profileUrl;

                        newUser.save(function(err){
                            if(err)
		    						throw err;
		    					return done(null, newUser);
		    				})
		    				console.log(profile);
		    			}
		    		});
	    		} else {
	    			var user = req.user;
	    			    user.vkontakte.id = profile.id;
                        user.vkontakte.username = profile.username;
                        user.vkontakte.token = accessToken;
                        user.vkontakte.name.firstName = profile.name.givenName;
                        user.vkontakte.name.lastName = profile.name.familyName;
                        user.vkontakte.gender = profile.gender;
                        user.vkontakte.profileUrl = profile.profileUrl;

					user.save(function(err){
						if(err)
							throw err;
						return done(null, user);
					});
					console.log(profile);
	    		}
	    		
	    	});
	    }

	));
    
};