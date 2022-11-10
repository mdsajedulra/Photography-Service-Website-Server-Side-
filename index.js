const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()   //dotenv config
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json())


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6crvlzi.mongodb.net/?retryWrites=true&w=majority`;

const uri = "mongodb://0.0.0.0:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const serviceCollection = client.db("photography").collection("services");
const reviewCollection = client.db("allReview").collection("Review");
// photography
// .services

app.get('/', (req, res) => {
    res.send('server is running')
})
app.get('/service', async (req, res) => {
    try {
        const cursor = serviceCollection.find({}).limit(3);
        const result = await cursor.toArray()
        res.send(result)
    } catch (error) {
        res.send(error.message)
    }
})
app.get('/allservice', async (req, res) => {
    try {
        const cursor = serviceCollection.find({});
        const result = await cursor.toArray()
        res.send(result)
    } catch (error) {
        res.send(error.message)
    }
})
app.get('/servicedetails/:id', async (req, res) => {
    const id = req.params.id;
    // console.log(id)
    try {

        const result = await serviceCollection.findOne({ _id: ObjectId(id) });
        res.send(result)
    } catch (error) {
        res.send(error.message)
    }
})
// post api
app.post('/review', async (req, res) => {
    const data = req.body;
    // console.log(data)
    try {
        const result = await reviewCollection.insertOne(data);

    } catch (error) {
        res.send(error)
    }
})
// review get api by service id
app.get('/review/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const cursor = reviewCollection.find({ reviewId: (id) });
        const result = await cursor.toArray()
        res.send(result)

    } catch (error) {
        res.send(error)
    }
})

// review get api by user
app.get('/review/user/:id', async (req, res) => {
    const email = req.params.id;

    try {
        const cursor = reviewCollection.find({ email: (email) });
        const result = await cursor.toArray()
        res.send(result)

    } catch (error) {
        res.send(error)
    }
})
//add service api
app.post('/addservices', async (req, res) => {
    try {
        const service = req.body;

        const result = await serviceCollection.insertOne(service)
        console.log(result)
    } catch (error) {
        res.send(error)
    }
})
//revew delete from user
app.delete('/deletereview/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const result = await reviewCollection.deleteOne({ _id: ObjectId(id) })
        // res.send(id)
        res.send({
            data: result,
        })
    } catch (error) {
        res.send(error)
    }
})

// get review by id
app.get('/getreviewid/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await reviewCollection.findOne({ _id: ObjectId(id) })
        res.send(result)

    } catch (error) {
        res.send(error)
    }
})


app.patch('/reviewupdate/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await reviewCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body })
        res.send({
            success: true,
            data: result
        })
    } catch (error) {
        res.send({
            success: false,
            message: 'something wrong'
        })
    }
})





app.listen(port, () => {
    console.log(`Photography by Sajedul server is running on ${port}`)
})