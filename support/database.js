const config = require('config');
const Sequelize = require("sequelize");
const mongoose = require('mongoose');
const autoIncrementFactory = require('mongoose-sequence');

let sequelizeCon;
let autoIncrement ;
async function initialize() {
    const databaseConObj = {};
   
    try {
      mongoose.Promise = Promise;
      mongoose.pluralize(null);
      { useNewUrlParser: true }
      const mongoCon = await mongoose.connect(config.mongoDBConnection, {useNewUrlParser: true, useUnifiedTopology: true});
      const autoIncrement = autoIncrementFactory(mongoCon);
      databaseConObj.mongoCon = mongoCon;
      databaseConObj.autoIncrement = autoIncrement;
    } catch (err) {
    }
   
    return databaseConObj;
}

module.exports.initialize = initialize;

module.exports.mongoose = mongoose;
async function close() {
  await sequelizeCon.close();
}

module.exports.close = close;