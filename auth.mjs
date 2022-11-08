import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// assumes that User was registered in `./db.mjs`
const User = mongoose.model('User');

const startAuthenticatedSession = (req, user, cb) => {
  // TODO: implement startAuthenticatedSession
  req.session.regenerate((err) => {
    if(!err){
      req.session.user = user;
    }
    else{
      console.log("Error starting authentication session:", err);
    }
    cb(err);
  });
};

const endAuthenticatedSession = (req, cb) => {
  // TODO: implement endAuthenticatedSession
  req.session.destroy((err) => {
     cb(err); 
  });
};


const register = (firstName, lastName, email, password, errorCallback, successCallback) => {
  // TODO: implement register
  let errObj;

  if(password.length >= 8){
    User.findOne({email: email}, (err, result) => { 
      if(!result){
        bcrypt.genSalt(10, function(err, salt) {
          //We can use a default value of 10 for salt rounds 
          bcrypt.hash(password, salt, function(err, hash) {
              if(!err){
                const user = new User({
                  firstName: firstName,
                  lastName: lastName,
                  email:email,
                  password:hash,
                  untitledList:0,
                list:[]
                });
                user.save((err, userObj) => {
                  if(!err){
                    successCallback(userObj);
                  }
                  else{
                    errObj = {
                      message:'DOCUMENT SAVE ERROR',
                    };
                    errorCallback(errObj);
                  }
                });
              }
              else{
                errObj = {
                  message:'DOCUMENT SAVE ERROR',
                };
                errorCallback(errObj);
              }
          });
      });
      }
      else{
        errObj = {
          message:'EMAIL ALREADY EXISTS'
        };
        errorCallback(errObj);
      }
    });

  }
  else{
    errObj = {
      message:'PASSWORD TOO SHORT'
    };
    errorCallback(errObj);
  }
};

const login = (email, password, errorCallback, successCallback) => {
  User.findOne({email: email}, (err, user) => {
    let errObj;
    if (!err && user) {
      //then check if the password entered matches the password in the database
      //the password in the database is salted and hashed… and contains the salt
      //so a simple compare with === is not adequate
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        //note that passwordMatch within the callback will be either true or false, 
        //signifying whether or not the salted and hashed version of the incoming password 
        //matches the one stored in the database
        if(!err && passwordMatch){
          successCallback(user);
        }
        else{
          errObj = {
            message:'PASSWORDS DO NOT MATCH'
          };
          errorCallback(errObj);
        }
       });
    }
    else{
      errObj = {
        message:'USER NOT FOUND'
      };
      errorCallback(errObj);
    }
   });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = authRequiredPaths => {
  return (req, res, next) => {
    if(authRequiredPaths.includes(req.path)) {
      if(!req.session.user) {
        res.redirect('/login'); 
      } else {
        next(); 
      }
    } else {
      next(); 
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired
};