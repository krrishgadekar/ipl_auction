import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Player from './models/Player'; 

dotenv.config({ path: './config.env' }); // Load env variables

// 1. Connect to DB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB Connection Successful!'));

// 2. Read the JSON file
const players = JSON.parse(fs.readFileSync(`backend/src/csvjson.json`, 'utf-8'));

// 3. Import Data Function
const importData = async () => {
  try {
    await Player.create(players); // Accepts an array of objects!
    console.log('Data Successfully Loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// 4. Delete All Data Function (Optional: to clear DB before loading)
const deleteData = async () => {
  try {
    await Player.deleteMany(); // Deletes everything in this collection
    console.log('Data Successfully Deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// 5. Command Line Arguments Logic
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}