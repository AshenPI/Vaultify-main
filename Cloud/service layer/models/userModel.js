const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const userSchema = mongoose.Schema({

  name:{ type: String, required: true },
  userName: { type:String, required: true , unique: true},
  isAdmin: {type : Boolean , required:true},
  userId: { type: String, },
  password: { type: String, required: true  },
    
  
  
}, {timestamps : true});

userSchema.pre("findOneAndUpdate", async function(next) {


  try {
   if (this._update.password) {
     const hashed = await bcrypt.hash(this._update.password, 10);
     this._update.password = hashed;
   }
   next();
 } catch (err) {
   return next(err);
 }

})

userSchema.pre("save", function (next) {
  const user = this

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function(hashError, hash) {
          if (hashError) {
            return next(hashError)
          }

          user.password = hash
          next()
        })
      }
    })
    
  } else {
    return next()
  }
})


const userModel = mongoose.model("users", userSchema);

module.exports = userModel;