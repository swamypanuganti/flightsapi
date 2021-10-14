const database = require('./database');
const fs = require('fs');
const db = {};
async function initialize(config, mongoCon, mongoose, autoIncrement) {
  const fs = require('fs');
  const fileList = fs.readdirSync(`./models`);
  fileList.forEach(file => {
    db[file.split('.js')[0]] = require(`../models/${file}`)(mongoCon, mongoose, autoIncrement, config);
  });
  return db;
};
module.exports.initialize = initialize;