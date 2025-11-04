import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date },
  },
  { 
    timestamps: true,
    collection: 'users'
  }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  delete userObject.resetPasswordOTP;
  delete userObject.resetPasswordOTPExpires;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
