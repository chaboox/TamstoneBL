const mongoose = require('mongoose');

var qualitieSchema = new mongoose.Schema({
    name: {
        type: String,
    }
});

mongoose.model('Qualitie', qualitieSchema);
