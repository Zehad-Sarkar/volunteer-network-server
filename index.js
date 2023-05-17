const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// require('crypto').randomBytes(64, function(err, buffer) {
// var token = buffer.toString('hex');
// console.log(token);
// });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7em2cfy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const volunteerCollection = client
      .db("volunteerDB")
      .collection("volunteers");
    const servicesCollection = client.db("volunteerDB").collection("services");

    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    // app.get("/volunteers/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await volunteerCollection.find(query).toArray();
    //   console.log(result);
    //   res.send(result);
    // });

    app.get("/volunteer", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const result = await volunteerCollection.find(query).toArray();
      // console.log(result);
      res.send(result);
    });

    app.post("/regVolunteer", async (req, res) => {
      const body = req.body;
      const result = await volunteerCollection.insertOne(body);
      res.send(result);
    });

    app.delete("/deletedItem/:id", async (req, res) => {
      const result = await volunteerCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      // console.log(req.params.id);
      // console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("volunteer network running");
});
app.listen(port, (req, res) => {
  console.log(`volunteer network running port: ${port}`);
});
