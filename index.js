const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {ObjectId} = require('mongodb');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgpqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000;



app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})


client.connect(err => {
    const newsCollection = client.db("prothomAlo").collection("newsCollection");
    const adminList = client.db("prothomAlo").collection("adminCollection");

    app.post('/admin', (req, res) => {
        const email = req.body;
        adminList.insertOne(email)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    app.post('/addNews', (req, res) => {
        const newNews = req.body;
        console.log(newNews);
        newsCollection.insertOne(newNews)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/news', (req, res) => {
        newsCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
    app.get('/news/:id', (req, res) => {
        newsCollection.find({ _id: ObjectId(req.params.id)})
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        console.log(email)
        adminList.find({ info: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })
});


app.listen(process.env.PORT || port)