var bodyparser = require('body-parser');
var validator = require('express-validator'); // for form validationvar popupS = require('popups');
var commonFunctions = require('../config/common');
var userSchemaAuth = require('../models/userSchemaAuth');



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
        res = commonFunctions.security(res);

        res.send("users");
    });

    app.get('/registration', function (req, res) {
        res = commonFunctions.security(res);

        res.render('abcAppView/registration');
        // console.log("abcAppView/registration");
    });
    app.post('/SubmitRegistration', function (req, res) {
        res = commonFunctions.security(res);

        console.log(JSON.stringify(req.body.data.ServiceName));
        req.checkBody("data.params[0].v", 'Please Enter Your Name.').notEmpty();
        req.checkBody("data.params[1].v", 'Please Enter a valid email address.').isEmail();
        req.checkBody("data.params[2].v", 'Please select a country.').notEmpty();
        req.checkBody("data.params[3].v", 'Please Enter Password.').notEmpty();


        var errors = req.validationErrors();
        // console.log(errors);
        if (errors) {
            // res.send(errors);   
            var errorsData = {};
            var success = {};
            var output = [];

            success["service"] = req.body.data.ServiceName;
            success["success"] = "false";

            success["output"] = errors;
            errorsData["data"] = success;

            res.send(errorsData);
            //   console.log(errorsData);

            return;
        } else {
            var successData = {};
            var success = {};
            var output = [];


            output.push({
                "k": 'Name',
                'v': "Ramiz"
            })


            success["service"] = req.body.data.ServiceName;
            success["success"] = "true";

            success["output"] = output;
            successData["data"] = success;

            res.send(successData);

        }

    });

    app.get('/registredUsersView', function (req, res, data) {
        res = commonFunctions.security(res);
        res.render('abcAppView/registredUsersView', {
            data: data
        });
        console.log("abcAppView/registredUsersView");

    });


    // **********************************************************************************************************************
    //Worker api Started from here

    app.post('/workerApi/registration', function (req, res, data) {
        // commonFunctions.dbConnectionWorker();

        console.log("/workerApi/registration");
        var params = req.body.data.params;
        var ServiceName = req.body.data.ServiceName;
        var name, email, mobile, password;
        if (params.length > 0) {
            email = commonFunctions.getkeyValue(params, 'email');
            name = commonFunctions.getkeyValue(params, 'name');
            mobile = commonFunctions.getkeyValue(params, 'mobile');

            password = commonFunctions.getkeyValue(params, 'password');
        }
        console.log(params);
        var output = [];
        var error = [];
        commonFunctions.dbConnectionWorker();

        res = commonFunctions.security(res);
        // 
        var userData = {
            email: email,
            username: name,
            password: password,
            mobile: mobile,
        }
        userSchemaAuth.collection.createIndex({
            email: 1
        }, {
            unique: true
        });
        userSchemaAuth.create(userData, function (err, user) {
            if (err) {
                //duplicate key code 11000
                console.log(err)
                error.push({
                    'key': 'msg',
                    'value': err.message
                });
                error.push({
                    'key': 'errorcode',
                    'value': err.code
                });

                res.send(commonFunctions.responseGenerator(ServiceName, "false", output, error));
                console.log(commonFunctions.responseGenerator(ServiceName, "false", output, error));

            } else {
                output.push({
                    'key': 'email',
                    'value': user.email
                });
                res.send(commonFunctions.responseGenerator(ServiceName, "true", output, error));

            }
        });

    });

    app.post('/workerApi/login', function (req, res) {
        // console.log("workerApi/login");


        // console.log(JSON.stringify(req.body.data));
        var params = req.body.data.params;
        var ServiceName = req.body.data.ServiceName;
        var email, password;
        if (params.length > 0) {
            email = commonFunctions.getkeyValue(params, 'email');
            password = commonFunctions.getkeyValue(params, 'password');
        }
        // console.log(params[0].k);
        var output = [];
        var error = [];
        commonFunctions.dbConnectionWorker();

        userSchemaAuth.findOne({
                email: email
            })
            .exec(function (err, user) {
                if (err) {
                    // console.log(err)
                    error.push({
                        'key': 'msg',
                        'value': "Somthing went Wrong Please try again."
                    });

                    res.send(commonFunctions.responseGenerator(ServiceName, "false", output, error));

                } else if (!user) {
                    error.push({
                        'key': 'msg',
                        'value': "User not found."
                    });
                    res.send(commonFunctions.responseGenerator(ServiceName, "false", output, error));

                } else {
                    output.push({
                        'key': 'email',
                        'value': user.email
                    });
                    res.send(commonFunctions.responseGenerator(ServiceName, "true", output, error));

                }

            });


    });

    // pdf manuplation
    app.get('/uploadPDF', function (req, res, data) {
        res = commonFunctions.security(res);
        res.render('abcAppView/uploadPDF', {
            data: data
        });
        console.log("abcAppView/uploadPDF");

    });

    var fs = require('fs');
    var multer = require('multer');
    var upload = multer({
        dest: 'tmp/'
    })
    app.post('/api/pdfuplod', upload.single('file'), function (req, res) {
        var file = __dirname + '/' + "tmp.pdf";
        var output = __dirname + '/' + "output.pdf";
        console.log(file);
        console.log(req.file.path);
        fs.rename(req.file.path, file, function (err) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {


                const HummusRecipe = require('hummus-recipe');
                const pdfDoc = new HummusRecipe(file, __dirname + '/' + 'output.pdf');


                var length = pdfDoc.metadata.pages;
                console.log(length);
                for (var i = 1; i <= length; i++) {
                    pdfDoc

                        .editPage(i)
                        .text('Add some texts to an existing pdf file', 40, 40, {
                            color: '000000',
                            bold: true,

                        })

                        .endPage()

                    if (i == length) {
                        pdfDoc.endPDF();
                        //Send PDF from Server     
                        fs.readFile(output, function (err, data) {
                            res.contentType("application/pdf");
                            res.setHeader('Content-disposition', 'attachment; filename="' + "Script.pdf" + '"'); // dowload
                            // res.setHeader('Content-disposition', 'inline; filename="' + "Script.pdf" + '"');// view in browser
                            res.send(data);
                        });

                        fs.unlink(file,  function (err) {
                            if (err) throw err;
                            // if no error, file has been deleted successfully
                            console.log('Input File deleted!');
                            fs.unlink(output,  function (err) {
                                if (err) throw err;
                                // if no error, file has been deleted successfully
                                console.log('output File deleted!');
                            });  
                        });  
                    }

                }

                //   res.json({
                //     message: 'File uploaded successfully',
                //     filename: req.file.filename

                // });
            }
        });


    });



}