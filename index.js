const config = require('config');
const webServer = require('./support/web-server');
const database = require('./support/database');
const associations = require('./support/associations');
const path = require('path');
const moment = require('moment');

async function startup() {
  try {
    // logger.info('Initializing database module');
    const databaseConObj = await database.initialize();
    // const sequelizeCon = databaseConObj.sequelizeCon;
    const db = await associations.initialize(config, databaseConObj.mongoCon, database.mongoose, databaseConObj.autoIncrement);
    // await database.modelGenerator(moment);
  
    // logger.info('Initializing web server module');
    const commonObjects = {
      config: config,
      mongoCon:  databaseConObj.mongoCon,
      mongoose:  database.mongoose,
      mongooseAutoIncrement: databaseConObj.autoIncrement,
      // logger: logger,
      path: path,
      db: db,
      moment: moment
    }
    await webServer.initialize(commonObjects);
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }
}
 
startup();

async function shutdown(e) {
    let err = e;
       
    try {
   
      await webServer.close();
    } catch (e) {
   
      err = err || e;
    }
    try {
        await database.close(); 
    } catch (err) {
        err = err || e;
    }

    if (err) {
      process.exit(1); // Non-zero failure code
    } else {
      process.exit(0);
    }
  }
   
  process.on('SIGTERM', () => {
    shutdown();
  });
   
  process.on('SIGINT', () => {
    shutdown();
  });
   
  process.on('uncaughtException', err => {
    logger.error('Uncaught exception', err.stack);
    shutdown(err);
  });