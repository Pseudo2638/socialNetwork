var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName   : {type:String,default:'',required:true},
    lastName    : {type:String,default:'',required:true},
    userName    : {type:String,default:'',required:true},
    password    : {type:String,default:'',required:true},
    emailId     : {type:String,default:'',required:true},
    phoneNo     : {type:Number,default:''}
});

mongoose.model('User',userSchema);
