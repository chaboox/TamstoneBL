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
            comment:String,
            uv:String,
            surface:String,
            pu:String,
            prix:String,
            idbl:String,
            prestation:{
                type:[{
                    name:String,
                    surface:String, 
                    pu:String,
                    prix:String,
                    surfacer:String,
                    products:String,
                    pus:String,
                    prixs:String,
                    surfacers:String,
                    
                }]
            },
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
    },
    clientname: {
        type: String
    },
    project: {
        type: String
    },
    tva: {
        type: String
    },
    chauffeur: {
        type: String
    },
    matricule: {
        type: String
    },
    volumes: {
        type: String
    },
    
});


mongoose.model('Bl', BLSchema);