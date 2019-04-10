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
            prix:String}]
    },
    client: {
        type: String
    }
});


mongoose.model('Bl', BLSchema);

