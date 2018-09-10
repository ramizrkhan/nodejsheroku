
var User = require('../models/userModel');
var Security = require('../config/common');

module.exports =function(app){
    app.get('/api/setupUser',function(req,res){
        res= Security.security(res);

        console.log(req.path);
        //seed data
        var starterUser = [
            {
                "name":"ramiz",
                "birthYear":85,
                "address":"Parbhani",
                "mobileNo":"+918605362829",
                "profession":"Software Engineer"
            },
            {
                "name":"Sohel",
                "birthYear":91,
                "address":"Aurangabad",
                "mobileNo":"+910000000000",
                "profession":"Software Engineer"
            }
        ];
        User.create(starterUser,function(err,result){
            res.send(result);
        })

        
    });
}