const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

// volunteerNetwork
// volunteer0099


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svjmy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 9010




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const categoriesCollection = client.db("volunteerNetwork").collection("categories");
  const registerCollection = client.db("volunteerNetwork").collection("register");


  
    //Load volunteer category from database
    app.get('/categories', (req, res) => {
        categoriesCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })


    //post register form to mongodb
    app.post('/addRegister', (req, res) => {
      const register = req.body;
      console.log(register);
      registerCollection.insertOne(register)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })



    app.get('/volunteerEvents', (req, res) => {
      registerCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })


    app.delete('/cancelVolunteerEvent', (req, res) => {
      registerCollection.deleteOne({_id:ObjectID(req.headers.id)})
      .then(result => {
        res.send(result.deletedCount > 0)
      })
    })


    app.get('/allRegisteredEvent', (req, res) => {
      registerCollection.find({})
      .toArray( (err, documents) => {
        res.send(documents);
      })
    })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)