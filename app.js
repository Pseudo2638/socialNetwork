var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var path =require('path');

app.use(logger('dev'));
app.use(bodyParser.json({ limit:'10mb',extended: true }));
app.use(bodyParser.urlencoded({ limit:'10mb',extended: true }));
app.use(cookieParser());
app.use(session({
    secret : 'myAppSecret',
    resave :  true,
    saveUninitialized : true,
    cookie :  {secure:false}
}));

app.set('view engine','jade');
app.set('views',path.join(__dirname + '/app/views'));


// Defining the path of the mongodb database //
// Please note: it is saved by default in data/db folder //
// And, here myblogapp is the name of the database created //
// Mongodb(noSql) biggest advantage over SQL is that is highly flexible and it takes minimal amount of space on the disk //
var dbPath = 'mongodb://localhost/mysocialnetwork';

// Making connection to the database for further database transactions //
db = mongoose.connect(dbPath);

// This is a mongoose inbuilt function which is used to open the connection to the database //
mongoose.connection.once('open',function(){
    // Show success message in the terminal //
  console.log('Good to go for database part also ')
});

var fs = require('fs');

fs.readdirSync('./app/models').forEach(function(file){

    if(file.indexOf('.js'))
    {
       require('./app/models/'+file);
    }
});

fs.readdirSync('./app/controllers').forEach(function(file){

    if(file.indexOf('.js'))
    {
        var route = require('./app/controllers/'+file);
        route.controllerFunction(app)
    }
});

// 404 stands for 'status: not found' //
// So, if a user enter a wrong url, this function would get executed //
app.get('*',function(req,res,next){
  // Here, req is : request and res: is response //
  // Responce is send data to the browser and Request is used to get data //

   // Send response to the user //
   res.status = 404;

   // next() is an callback function  //
   // It is used to call an other function or display any message //
   // Callback function main concept is to not wait for above functions to execute, rather make them call at places we want //
   // Generally in this case used to throw an display error message to the user //
   next('You have mistyped the url. Please check.');
});

// This is an error handling middleware //
// This would take data error status from the above function using 'err' and alter the error message by display our custom message //
app.use(function(err,req,res,next){

   // Show message in the terminal (For developer's reference) //
   console.log('Our custom error handler was used !');
   // If the error status passed is 404 ie: url not found //
   if(res.status==404)
   {
    // Send response to the user //
    res.send('Oops ! I think you have landed on an wrong section section of the website. Please redirect to homepage.');
   }
   else
   {
    // Send error as response to the user //
    res.send(err);
   }
});

app.listen(2000,function(){

    console.log('Our app is now active on port 2000 ! Booyah !!');

});
