var mongoose = require('mongoose');
var bcrypt = require("bcrypt");
var userSchema = mongoose.Schema({
	local: {
		username: String,
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: {
			firstName: String,
			lastName: String
		},
		gender: String,
		profileUrl: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: {
			firstName: String,
			lastName: String
		},
		gender: String,
		profileUrl: String
	},
	vkontakte: {
		id: String,
		username: String,
		token: String,
		email: String,
		name: {
			firstName: String,
			lastName: String
		},
		gender: String,
		avatar: String,
		profileUrl: String
	}
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(13));
};

userSchema.methods.validPassword = function(password){
		return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);