const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const expressWs =  require('express-ws')(app);

const indexRouter = require('./routes/index');
const wsRouter = require('./routes/ws');

const billsRouter = require('./routes/bills');
app.use('/api/bills', billsRouter);

const deviceManager = require('./services/device-manager');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/bills', (req, res) => {
  res.render('bills', { 
    title: 'Bills',
    // Pass any dynamic data here if required
  });
});

app.get('/analytics', (req, res) => {
  res.render('analytics', { title: 'Analytics' });
});

app.get('/television', (req, res) => {
  res.render('television', { title: 'Television' });
});

app.get('/washing-machine', (req, res) => {
  res.render('washing-machine', { title: 'Washing Machine' });
});


app.get('/', async (req, res) => {
  try {
    const devices = await deviceManager.getAllDevices();
    console.log('Devices passed to template:', devices); // Debug
    res.render('index', { title: 'Devices', devices });
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).send('Error loading devices');
  }
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ws', wsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || '3000');

module.exports.getWsClientCount = function() {
  return expressWs.getWss().clients.size;
};

module.exports.getWsClients = function() {
  return expressWs.getWss().clients;
};
