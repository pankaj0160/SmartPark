import mongoose from 'mongoose';

// Use a separate test database — never your real one!
const TEST_DB_URL = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/smartpark_test';

export async function connectTestDB() {
  await mongoose.connect(TEST_DB_URL);
}

export async function disconnectTestDB() {
  await mongoose.connection.dropDatabase(); // wipes test data after each run
  await mongoose.connection.close();
}

export async function clearCollections() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}