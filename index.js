const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afytx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db("creativeAgency").collection("order");
    const reviewCollection = client.db("creativeAgency").collection("review");
    const adminCollection = client.db("creativeAgency").collection("admin");
    const productsCollection = client.db("creativeAgency").collection("products");
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/review', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })



    app.post('/orderByEmail', (req, res) => {
        const email = req.body;
        orderCollection.find({ email: email.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.post('/addProduct', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        productsCollection.insertOne({ title, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addAAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })
    app.get('/orders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

});


app.listen(process.env.PORT || port)