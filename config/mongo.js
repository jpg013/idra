const mongoose = require('mongoose');
const chalk    = require('chalk');

/**
 * Configure Mongo.
 */
const config = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI);
  mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });
}

module.exports = {
  config
};