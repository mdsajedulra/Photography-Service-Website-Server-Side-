const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json())


const uri = "mongodb://0.0.0.0:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const serviceCollection = client.db("photography").collection("services");
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

app.listen(port, () => {
    console.log(`Photography by Sajedul server is running on ${port}`)
})