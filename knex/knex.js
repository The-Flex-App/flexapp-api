require('dotenv').config();
const environment = process.env.NODE_ENV;
const configuration = require('../knexfile.js')[environment];

module.exports = configuration;
