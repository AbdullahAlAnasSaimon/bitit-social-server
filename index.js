const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.BITIT_MONGO_USER_DB}:${process.env.BITIT_USER_PASS}@cluster0.rencz4l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  
}
run().catch(err => console.error(err));

app.get('/', (req, res) =>{
  res.send('Bitit server is running successfully');
})

app.listen(port, () =>{
  console.log('Bitit server is running on port: ', port);
})