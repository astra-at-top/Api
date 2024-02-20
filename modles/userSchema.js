const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt")

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select : false
  },
  tc: {
    type: Boolean,
    required: [true, 'Terms and conditions acceptance is required'],
    validate: {
      validator: function(value) {
        return value === true;
      },
      message: 'You must accept the terms and conditions'
    }
  }
});

// if you want to compare the password and confirmpassword
// confirmPassword: {
//   type: String,
//   required: true,
//   validate: {
//     validator: function(confirmPassword) {
//       // 'this' refers to the document being validated
//       return confirmPassword === this.password;
//     },
//     message: 'Password and confirm password do not match'
// }

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) next()
    this.password = await bcrypt.hash(this.password,12)
    this.role = "user"
    next()
})

userSchema.methods.comparePassword =  function (obj) {
    return  bcrypt.compare(obj.userPassword, obj.encryptedpass)
}

module.exports = mongoose.model('User', userSchema);
