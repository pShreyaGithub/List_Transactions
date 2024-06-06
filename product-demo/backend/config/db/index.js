const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://pshreya716:Shreya0000@transactiontable.cstpyqw.mongodb.net?retryWrites=true&w=majority&appName=TransactionTable",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName:'Sales'
      }
    );
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
