const { MongoClient } = require("mongodb");

async function connectToMongoDB() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri =
    "mongodb+srv://adi:admin123@cluster0.sipfk.mongodb.net/blog-app";

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect(()=> console.log('connected to db'));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = connectToMongoDB;
