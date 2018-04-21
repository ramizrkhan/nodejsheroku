const cool = require('cool-ascii-faces')
var express = require('express')
var config = require('./config');
var app = express();
var mongoose = require('mongoose');
var setupController = require('./controllers/setUpController');
var apiController = require('./controllers/apiController');

const path = require('path')
const PORT = process.env.PORT || 5000

// app.use('./assets', express.static(path.join(__dirname, '/public')));
// express()
  app.use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .get('/ramiz', (req, res) => res.send(cool()))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))

//get databaseConnection
mongoose.connect(config.getDBConnectionString());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));


setupController(app);
apiController(app);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if(req.accepts('html')) {
      res.render('errors/404', {error: 'The resource you where looking for is not available.'});
      return;
  };

  // respond with json
  if(req.accepts('json')) {
      res.send({ error: 'The resource you where looking for is not available.' });
      return;
  }
  // default to plain-text. send()
  res.type('txt').send('The resource you where looking for is not available.');
});
app.use(function(err, req, res, next){
  console.log(err);
  // we may use properties of the error object
  // here and next(err) appropriately, or if

  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);

  // respond with html page
  if(req.accepts('html')) {
      res.render('errors/500.html', {error: 'Something is broken on our end, email us if this issue persist.'});
      return;
  }

  // default to plain-text. send()
  res.type('txt').send('Something is broken on our end, email us if this issue persist.');
});
app.listen(PORT);