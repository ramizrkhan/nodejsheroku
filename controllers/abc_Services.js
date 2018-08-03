var bodyparser = require('body-parser');

module.exports = function(app){

    app.get('/abcServices',function(req,res){
        res.send("users");
    });

    app.get('/registration',function(req,res){
        res.render('abcAppView/registration');
        console.log("abcAppView/registration");
    });
    app.get('/registredUsersView',function(req,res){
        res.render('abcAppView/registredUsersView');
        console.log("abcAppView/registredUsersView");

    });

    
}