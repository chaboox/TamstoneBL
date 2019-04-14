const mongoose = require('mongoose');

var finitioncSchema = new mongoose.Schema({
    name: {
        type: String,
    }
});

mongoose.model('Finitionc', finitioncSchema);
