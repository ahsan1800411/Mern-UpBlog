import mongoose from 'mongoose';

const connectDatabase = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI as string);

  console.log(`Connected to Db with ${conn.connection.host}`);
};

export default connectDatabase;
