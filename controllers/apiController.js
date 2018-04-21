var Users = require('../models/userModel');
var bodyparser = require('body-parser');

module.exports = function(app){
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended: true}));

    app.get('/api/users/:username',function(req,res){
        Users.find({name:req.params.username},function(err,users){
            if(err) throw err;
            res.send(users);
        });
    });

    app.get('/api/user/:id',function(req,res){
        Users.findById({_id: req.params.id},function(err,user){
            if (err) throw err;
            res.send(user);
        });
    });

    app.post('/api/user',function(req,res){
        if(req.body.id){
            Users.findByIdAndUpdate(req.body.id,{
                birthYear:req.body.birthYear,
                address:req.body.address,
                mobileNo:req.body.mobileNo,
                profession:req.body.profession            
            },function(err,user){
                if(err) throw err;
                res.send("Success");
            });
        }else{
            var newUser = Users({
                name:"Test",
                birthYear:req.body.birthYear,
                address:req.body.address,
                mobileNo:req.body.mobileNo,
                profession:req.body.profession
            });
            newUser.save(function(err){
                if (err) throw err;
                res.send("success");
            });
        }
    });

    app.delete('/api/todo',function(req,res){
        Users.findByIdAndRemove(req.body.id,function(err){
            if(err) throw err;
            res.send('Success');
        });
    });


}