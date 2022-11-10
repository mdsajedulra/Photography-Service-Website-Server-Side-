const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
var jwt = require('jsonwebtoken'); // jwt require
require('dotenv').config()   //dotenv config
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {

        if (err) {
            res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
    // next()
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6crvlzi.mongodb.net/?retryWrites=true&w=majority`;

// for local server
// const uri = "mongodb://0.0.0.0:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const serviceCollection = client.db("photography").collection("services");
const reviewCollection = client.db("allReview").collection("Review");


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

// review get api by user with jwt
app.get('/review/user/:id', verifyJWT, async (req, res) => {
    const email = req.params.id;
    const decoded = req.decoded;
    // console.log(decoded)
    // console.log(req.params.id)

    // console.log(decoded.email, req.params.id)
    if (decoded.email !== req.params.id) {
        res.status(403).send({ message: 'unauthorized access' })
    }
    // console.log(req.headers.authorization)
    try {
        const cursor = reviewCollection.find({ email: (email) });
        const result = await cursor.toArray()
        const reverse = [...result.reverse()]
        res.send(reverse)

    } catch (error) {
        res.send(error)
    }
})
//add service api
app.post('/addservices', async (req, res) => {
    try {
        const service = req.body;
        const result = await serviceCollection.insertOne(service)
        res.send(result)
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

// review update api
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

//jwt
app.post('/jwt', (req, res) => {
    console.log(req.headers)
    try {
        const user = req.body;
        console.log(user)
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        res.send({ token })
    } catch (error) {
        console.log(error)
    }

})





app.listen(port, () => {
    console.log(`Photography by Sajedul server is running on ${port}`)
})