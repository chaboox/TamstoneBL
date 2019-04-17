const mongoose = require('mongoose');

var BLSchema = new mongoose.Schema({
    id: {
        type: String,
       // required: 'This field is required.'
    },
    date: {
        type: String
    },
    name: {
        type: String
    },
    products: {   
        type:[ {
            name:String,
            code:String,
            long:String,
            larg:String,
            epai:String,
            quantity:String,
            uv:String,
            surface:String,
            pu:String,
            prix:String,
            idbl:String,
            prestation:{
                type:[{
                    name:String,
                    surface:String
                }]
            }   ,
            longs:String,
            largs:String,
            epais:String,
            surfaces:String,
            pus:String,
            prixs:String, 
        }]
    },
    client: {
        type: String
    }
});

BLSchema.methods.testFunc = function testFunc(number) {
    return number + 1;
  }
  

mongoose.model('Bl', BLSchema);

