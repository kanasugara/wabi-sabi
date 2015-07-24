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
                } else {
                    var newUser = new User();
                    newUser.local.username = email;
                    newUser.local.password = newUser.generateHash(password);
                    
                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
    },
    function(req, email, password, done){
        process.nextTick(function(){
            User.findOne({'local.username': email}, function(err, user) {
                if(err)
                    return done(err);
                if(!user)
                    return done(null, false, req.flash('loginMessage', 'No user found'));
                if(!user.validPassword(password)){
                    return done(null, false, req.flash('loginMessage', 'Invalid password'));
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
        profileFields: ["emails", "displayName", "gender", "name", "profileUrl"]
      },
      function(accessToken, refreshToken, profile, done) {
            process.nextTick(function(){
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
            });
        }
    ));
    
     passport.use(new GoogleStrategy({
        clientID:       configAuth.googleAuth.clientID,
        clientSecret:   configAuth.googleAuth.clientSecret,
        callbackURL:    configAuth.googleAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
            process.nextTick(function(){
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
                        newUser.google.profileUrl = profile.url;

                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
	    				});
	    				console.log(profile);
                    }
                });
            });
        }
    ));
    
    passport.use(new VkontakteStrategy({
        clientID:       configAuth.vkontakteAuth.clientID,
        clientSecret:   configAuth.vkontakteAuth.clientSecret,
        callbackURL:    configAuth.vkontakteAuth.callbackURL,
        profileFields: ["email"]
      },
      function(accessToken, refreshToken, profile, done) {
            process.nextTick(function(){
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
                        newUser.vkontakte.gender = profile.sex;
                        newUser.vkontakte.profileUrl = profile.profileUrl;

                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
	    				});
	    				console.log(profile);
                    }
                });
            });
        }
    ));
    
};