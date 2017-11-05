var mongoose = require('mongoose');
var express = require('express');

var userRouter = express.Router();

var userModel = mongoose.model('User');

var responseGenerator = require('./../../libs/responseGenerator');

var fs = require('fs');
var response = {
     error: false,
     message: null,
     status:200,
     data:null
};

module.exports.controllerFunction = function(app){

     userRouter.get('/login/screen',function(req,res){
        res.render('login');
     });

     userRouter.get('/signup/screen',function(req,res){
        res.render('signup');
     });

     userRouter.get('/dashboard',function(req,res){
        if(req.session.currentUser !=  undefined)
        {
          res.render('dashboard',{user:req.session.currentUser});
        }
        else
        {
          res.redirect('/v1/users/login/screen');
        }
     });

     userRouter.get('/logout',function(req,res){
        req.session.destroy(function(err){
          res.redirect('/v1/users/login/screen');
        });
     });

     userRouter.get('/all',function(req,res){

        userModel.find({},function(err,allUsers){
          if(err)
          {
            res.send(err);
          }
          else
          {
            res.send(allUsers);
          }
        });
     });

    userRouter.post('/signup',function(req,res){

        if(req.body.firstName!=undefined && req.body.lastName!=undefined && req.body.userName!=undefined && req.body.password!=undefined && req.body.emailId!=undefined){
          var userData = new userModel({
            firstName   :   req.body.firstName,
            lastName    :   req.body.lastName,
            userName    :   req.body.userName,
            password    :   req.body.password,
            emailId     :   req.body.emailId,
            phoneNo     :   req.body.phoneNo
          });

          userData.save(function(error){
            if(error)
            {
              var errorMessage = responseGenerator.generate(true,error,500,null);
              res.send(errorMessage);
            }
            else
            {
              var successMessage = responseGenerator.generate(false,"Successfully Signed Up !!",200,userData);
              res.render('dashboard',{user:userData});
            }
          });
        }
        else
        {
          var errorMessage = responseGenerator.generate(true,'Some values which are required are not present. Please, refer to the API documentation.',500,null);
          res.render('error',{
            message : errorMessage.message,
            error   : errorMessage.data
          });
        }
    });

    userRouter.post('/login',function(req,res){
        userModel.findOne({$and:[{'userName':req.body.userName }, {'password':req.body.password}]},function(error,foundUser){
          if(error)
          {
            var errorMessage = responseGenerator.generate(true,'some error occured',500,null);
            res.send(errorMessage);
          }
          else if (foundUser == undefined || foundUser == null || foundUser.firstName == undefined || foundUser.lastName == undefined)
          {
            var errorMessage = responseGenerator.generate(true,'user data not found.',500,null);
            res.render('error',{
              message : errorMessage.message,
              error   : errorMessage.data
            });
          }
          else
          {
            res.render('dashboard',{user:foundUser});
          }
        });
    });

     userRouter.get('/:userName/info',function(req,res){
        userModel.findOne({'userName':req.body.userName},function(error,foundUser){
           if(error)
           {
             var errorMessage = responseGenerator.generate(true,'some error',500,null);
             res.send(errorMessage);
           }
           else if (foundUser == undefined || foundUser == null || foundUser.userName == undefined || foundUser.password == undefined) {
             var errorMessage = responseGenerator.generate(true,'User not found',500,null);
             res.render('error',{
               message : errorMessage.message,
               error   : errorMessage.data
             });
           }
           else {
             res.render('dashboard',{user:foundUser});
           }
        });
     });

     app.use('/v1/users',userRouter);

};
