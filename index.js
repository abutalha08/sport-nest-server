const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URI ;

const app = express()

const PORT = process.env.PORT;

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("sportNest");

    const facilityCollection = db.collection("facilities");
    const bookingCollection = db.collection("bookings");


    app.get('/facility', async(req,res) => {

        const result = await facilityCollection.find().toArray();
        res.json(result);

    })


    app.post('/facility', async(req, res) => {

        const facilityData = req.body;
        // console.log(facilityData)

        const result = await facilityCollection.insertOne(facilityData)

        res.json(result);


    })


    app.get('/facility/:id', async(req, res) => {

        const {id} = req.params

        const result = await facilityCollection.findOne({_id: new ObjectId(id)})

        res.json(result);

    })

    app.get("/my-facilities/:email", async (req, res) => {
  const { email } = req.params;

  const result = await facilityCollection
    .find({ ownerEmail: email })
    .toArray();

  res.json(result);
});

 app.patch("/facility/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      console.log(updatedData);

      const result = await facilityCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );

      res.json(result);
    });


     app.post("/booking", async (req, res) => {
      const bookingData = req.body;

      // console.log(bookingData)
      const result = await bookingCollection.insertOne(bookingData);

      res.json(result);
    });

    app.get("/booking/:userId", async (req, res) => {
      const { userId } = req.params;

      const result = await bookingCollection.find({ userId: userId }).toArray();

      res.json(result);
    });

    app.delete("/booking/:bookingId", async (req, res) => {
      const { bookingId } = req.params;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(bookingId),
      });

      res.json(result);
    });












    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is running fine")
})


app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})