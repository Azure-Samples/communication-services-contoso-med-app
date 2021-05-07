var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
// var bodyParser = require('body-parser');
var logger = require('morgan');

var dbClient = require('./db/index')
var dbInitializationService = require('./db/dbInitialize')

console.log('connecting to cosmosdb...')
dbClient.connect()
  .then(() => {
    console.log("connected to the database successfully")

    /* uncomment next line to reset database when application
     * starts. Appointments in db are flushed and regenerated */
    // dbInitializationService.initializeDB();
  })
  .catch((e) => {
    console.log(e)
  })

var indexRouter = require('./routes/index');
var userProvisionRouter = require('./routes/user.routes');
var authRouter = require('./routes/auth.routes');
var chatRouter = require('./routes/chat.routes');
var doctorsRouter = require('./routes/doctor.routes');
var appointmentsRouter = require('./routes/appointments.routes');
var botRouter = require('./routes/bot.routes');

var app = express();

// usages
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.static('public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userProvisionRouter);
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/bot', botRouter);

app.get('/reset', async (req, res) => {
  await dbInitializationService.initializeDB();
  res.status(200).send("<h1>Database reset completed successfully!</h1>")
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


module.exports = app;