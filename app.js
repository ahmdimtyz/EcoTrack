const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');
const hbs = require('hbs');

// Flask API URL
const FLASK_API_PREDICT_URL = 'http://127.0.0.1:5000/predict';

const app = express();
const expressWs =  require('express-ws')(app);

const indexRouter = require('./routes/index');
const wsRouter = require('./routes/ws');

const billsRouter = require('./routes/bills');
app.use('/api/bills', billsRouter);

const deviceManager = require('./services/device-manager');

hbs.registerHelper('increment', (value) => parseInt(value) + 1);
hbs.registerHelper('formatFloat', (value) => parseFloat(value).toFixed(2));
hbs.registerHelper('json', (context) => JSON.stringify(context));

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

app.get('/laptop', (req, res) => {
  res.render('laptop', { title: 'Laptop' });
});

app.get('/phone-charger', (req, res) => {
  res.render('phone-charger', { title: 'Phone Charger' });
});

// Define /insights route with Flask API integration
app.get('/insights', async (req, res) => {
  try {
    const response = await axios.post(FLASK_API_PREDICT_URL);

    // Check for all required data
    if (
      !response.data.monthly_usage ||
      !response.data.next_month_prediction ||
      !response.data.weekly_usage ||
      !response.data.next_week_prediction ||
      !response.data.daily_usage
    ) {
      throw new Error('Invalid response from Flask API');
    }

    const { 
      monthly_usage, 
      next_month_prediction, 
      weekly_usage, 
      next_week_prediction, 
      daily_usage 
    } = response.data;

    // Log for debugging
    console.log('Monthly Usage:', monthly_usage);
    console.log('Next Month Prediction:', next_month_prediction);
    console.log('Weekly Usage:', weekly_usage);
    console.log('Next Week Prediction:', next_week_prediction);
    console.log('Daily Usage:', daily_usage);

    // Render insights.hbs with the fetched data
    res.render('insights', {
      title: 'Insights',
      monthly_usage,
      next_month_prediction,
      weekly_usage,
      next_week_prediction,
      daily_usage,
    });
  } catch (error) {
    console.error('Error fetching insights:', error.message);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch insights.',
      error: error.message,
    });
  }
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
