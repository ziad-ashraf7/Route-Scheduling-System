import mongo from 'mongoose'


const driverSchema = new mongo.Schema({
  id: {
     type: String, 
     required: true, 
     unique: true 
    },

  name: String,

  licenseType: String,

  availability: 
  { 
    type: Boolean, 
    default: true 
},

  activeRoute: { 
    type: mongo.Schema.Types.ObjectId, 
    ref: 'Route', 

    default: null 
}

});

export default mongo.model('Driver', driverSchema);
