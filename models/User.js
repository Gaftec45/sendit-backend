const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ 
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' // Default role is 'user'
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  registrationDate: {
    type: Date,
    default: Date.now
  },
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', userSchema);