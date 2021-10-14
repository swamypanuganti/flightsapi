module.exports = function (mongoCon, mongoose, autoIncrement, config) {
  const Schema = mongoose.Schema;
  // define the schema for user model
  const flightsSchema = new Schema({
      _id: Number,
      airline: { type: String, required: true, trim: true, unique: true },
      airport: { type: String, required: false, trim: true, default: null, unique: true },
      flightNo: { type: Number, required: false, trim: true, default: null },
      departs: { type: Date, required: false, trim: true, default: null },
      is_enabled: { type: Boolean, default: true },
      is_deleted: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
  },{_id:false});    
  flightsSchema.plugin(autoIncrement,{id: `${config.tableNames.flights}_${config.identityCounterField}`});
  return mongoose.model(config.tableNames.flights, flightsSchema);
};

