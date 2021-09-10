const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect('mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER_NAME>.16zme.mongodb.net/<YOUR_COLLECTION_NAME>?retryWrites=true&w=majority');
  
  mongoose.connection.on('open', () => {
    console.log('MongoDB connection is successful.');
  });

  mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error: ', err);
  });
  
  mongoose.Promise = global.Promise;
}


