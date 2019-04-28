const mongoose = require('mongoose');
lastidSchema = new mongoose.Schema({
    id: {
        type: String,
    }
});

mongoose.model('Lastid', lastidSchema);
