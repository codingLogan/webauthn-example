import { MongoClient, ServerApiVersion } from "mongodb";

export default class DB {
  initialize() {
    const credentials = process.env.MONGO_CERT_PATH;

    this.client = new MongoClient(process.env.MONGO_URL, {
      sslKey: credentials,
      sslCert: credentials,
      serverApi: ServerApiVersion.v1,
    });
  }

  async run() {
    try {
      await this.client.connect();
      const database = this.client.db("authentication");
      const collection = database.collection("users");
      const docCount = await collection.countDocuments({});
      console.log(docCount);
      // perform actions using client
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close();
    }
  }
}
