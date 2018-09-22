var configValues = require('./config');
var mongoose = require('mongoose');

function security(res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    // res.header("Content-Security-Policy", "default-src 'self';script-src 'self';object-src 'none';img-src 'self';media-src 'self';frame-src 'none';font-src 'self' data:;connect-src 'self';style-src 'self'");

    return res;
};


function dbConnectionWorker() {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        },
        replset: {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        }
    };
    // return 'mongodb://'+configValues.userWorker+':'+configValues.passwordWorker+'@ds259742.mlab.com:59742/workerapi';
    //get databaseConnection
    mongoose.connect('mongodb://' + configValues.userWorker + ':' + configValues.passwordWorker + '@ds259742.mlab.com:59742/workerapi', function (err) {
        if (err) throw err;
    }, options);
    // mongoose.connection.on('connected', function () {
    //     console.log("Mongoose default connection is open to ", '@ds259742.mlab.com:59742/workerapi');
    // });
    // mongoose.connection.on('error', function (err) {
    //     console.log(("Mongoose default connection has occured " + err + " error"));
    // });


    // mongoose.connection.on('disconnected', function () {
    //     console.log(("Mongoose default connection is disconnected"));
    // });


    // process.on('SIGINT', function () {
    //     mongoose.connection.close(function () {
    //         console.log(("Mongoose default connection is disconnected due to application termination"));
    //         process.exit(0)
    //     });
    // });
}

function dbCloseWorker() {
    // mongoose.connection.close();
}

function responseGenerator(serviceName, success, output, error) {
    var gsuccessData = {};
    var gsuccess = {};

    gsuccess["service"] = serviceName;
    gsuccess["success"] = success;
    gsuccess["output"] = output;
    gsuccess["error"] = error;

    gsuccessData["data"] = gsuccess;

    return gsuccessData;
}



function getkeyValue(params, checkKeyName) {
    var value = "";
    for (var i = 0; i < params.length; i++) {
        for (var k in params[i]) {
            if (params[i][k] === checkKeyName) {
                value = params[i];
            }
        }
    }
    return value.v;
}
module.exports = {
    security: security,
    dbConnectionWorker: dbConnectionWorker,
    dbCloseWorker: dbCloseWorker,
    responseGenerator: responseGenerator,
    getkeyValue: getkeyValue
}