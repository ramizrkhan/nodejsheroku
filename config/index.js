var configValues = require('./config');

module.exports = {
    getDBConnectionString: function(){
        return 'mongodb://'+configValues.user+':'+configValues.password+'@ds237669.mlab.com:37669/addressbook';
    }
}