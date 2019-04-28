const mongoose = require('mongoose');


mongoose.connect('mongodb://10.10.10.52:27017/EmployeeDB', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./employee.model');
require('./quality.model');
require('./finition.model');
require('./finitionc.model');
require('./type.model');
require('./Bl.model');
require('./client.model');
require('./lastid.model');

