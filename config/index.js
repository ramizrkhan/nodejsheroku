var configValues = require('./config');

module.exports = {
    getDBConnectionString: function(){
        return 'mongodb://'+configValues.user+':'+configValues.password+'@ds111562.mlab.com:11562/test_db_ramiz';
    }
}