const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema= new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        required: true,
        unique: false
    },
    password:{
        type: String,
        required: true,
    }
});
const UserModel=mongoose.model('login', UserSchema);
module.exports = UserModel;