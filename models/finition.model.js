const mongoose = require('mongoose');

var finitionSchema = new mongoose.Schema({
    name: {
        type: String,
    }
});

mongoose.model('Finition', finitionSchema);
