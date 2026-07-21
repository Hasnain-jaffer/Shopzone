import mongoose from "mongoose";
const { connect } = mongoose;

const dbConnect = async () => {
  try {
    const mongodbConnection = await connect(process.env.CONNECTION_STRING);
    console.log(`MongoDB Connected: ${mongodbConnection.connection.host}, ${mongodbConnection.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
