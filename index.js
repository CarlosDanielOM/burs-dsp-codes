require('dotenv').config();
const express = require('express');
const path = require('path')
const mongoose = require('mongoose')

const app = express();
const port = 4545;

mongoose.connect(process.env.MONGODB_URI, {});
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
  console.log('Database connection established');
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});

mongoose.connection.on('error', error => {
  console.log('Database connection error: ', error);
})

mongoose.connection.on('disconnected', _ => {
  console.log('Database connection disconnected');
})

//* ROUTES IMPORTS *//

const lockerRoutes = require('./routes/v1/lockers');
const accessCodesRoutes = require('./routes/v1/accesscodes');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/v1/codes/lockers', lockerRoutes);
app.use('/v1/codes/access', accessCodesRoutes);
