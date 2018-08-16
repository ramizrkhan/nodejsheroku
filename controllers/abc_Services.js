var bodyparser = require('body-parser');
var validator = require('express-validator'); // for form validationvar popupS = require('popups');



module.exports = function (app) {
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({
        extended: true
    }));
    // custum validator
    app.use(validator({
        customValidators: {
            isArray: function (value) {
                return Array.isArray(value);
            },
            notEmpty: function (array) {
                return array.length > 0;
            },
            isEmail: function (email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
            gte: function (param, num) {
                return param >= num;
            }

        }
    }));

    app.get('/abcServices', function (req, res) {
        res.send("users");
    });

    app.get('/registration', function (req, res) {
        res.render('abcAppView/registration');
        // console.log("abcAppView/registration");
    });
    app.post('/SubmitRegistration', function (req, res) {
       console.log(JSON.stringify( req.body.data.ServiceName));
        req.checkBody("data.params[0].v", 'Please Enter Your Name.').notEmpty();
        req.checkBody("data.params[1].v", 'Please Enter a valid email address.').isEmail();
        req.checkBody("data.params[2].v", 'Please select a country.').notEmpty();
        req.checkBody("data.params[3].v", 'Please Enter Password.').notEmpty();


        var errors = req.validationErrors();
        // console.log(errors);
        if (errors) {
            res.send(errors);   

            return;
        } else {
            var successData = {};
            var success = {};
            var output = [];


            output.push({
                "k": 'Name',
                'v': "Ramiz"
              })
          

              success["service"]=req.body.data.ServiceName;
              success["success"]="true";

              success["output"] = output;
              successData["data"] = success;

              res.send(successData);

        }

    });

    app.get('/registredUsersView', function (req, res) {
        res.render('abcAppView/registredUsersView');
        console.log("abcAppView/registredUsersView");

    });


}