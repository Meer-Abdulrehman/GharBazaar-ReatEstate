import mongoose from 'mongoose';

const ConnectDb = async ()=>{
  mongoose.connection.on("connected", ()=>{
    console.log('databse connected')
  });

  await mongoose.connect(`${process.env.MONGO_URI}/gharbazaar?retryWrites=true&w=majority`);
}
export default ConnectDb;