const mongoose = require('mongoose');

var typeSchema = new mongoose.Schema({
    name: {
        type: String,
    }
});

mongoose.model('Type', typeSchema);
