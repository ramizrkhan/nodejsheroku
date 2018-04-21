var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name:String,
    birthYear:Number,
    address:String,
    mobileNo:String,
    profession:String

}) ;

var User = mongoose.model('USERs',UserSchema);

module.exports = User;
