const { connect, connection } = require('mongoose');

connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection; 