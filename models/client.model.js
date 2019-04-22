const mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    activity: {
        type: String
    },
    compte: {   
        type: String
    },
    adresse: {   
        type: String
    },
    adressepos: {   
        type: String
    },
    city: {   
        type: String
    },
    code: {   
        type: String
    },
    rc: {   
        type: String
    },
    mf: {   
        type: String
    },
    ai: {   
        type: String
    },
    adresse: {   
        type: String
    },
    number: {   
        type: String
    }
});


mongoose.model('Client', clientSchema);