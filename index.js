const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s2cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database'); database connect hoice ki na check kore
        const database = client.db("geniusCarMechanics");
        const servicesCollection = database.collection("services");

        // get api get all data
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        });


        // update api
        app.put('/services/:serviceId', async (req, res) => {
            const id = req.params.serviceId;
            console.log('updating', id)
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedService.name,
                    price: updatedService.price,
                    img: updatedService.img,
                    description: updatedService.description,

                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)

            res.send('updating')
        });

        // get a single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("getting specific id", id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        // post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log("hit the post api", service);
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        })

        // delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })





    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Genius Car Mechanics Server")
})
app.listen(port, () => {
    console.log("Running Genius server:", port)
});