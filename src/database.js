const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/electronDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(db => console.log('DB IS CONNECTED'))
    .catch(err => console.log(err));