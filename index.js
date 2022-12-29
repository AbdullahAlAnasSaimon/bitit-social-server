const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.BITIT_MONGO_USER_DB}:${process.env.BITIT_USER_PASS}@cluster0.rencz4l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  const postCollection = client.db(process.env.BITIT_MONGO_USER_DB).collection('posts');
  const commentCollection = client.db(process.env.BITIT_MONGO_USER_DB).collection('comments');

  app.post('/posts', async(req, res) =>{
    const postData = req.body;
    const result = await postCollection.insertOne(postData);
    res.send(result);
  })

  app.get('/posts', async(req, res) =>{
    const query = {};
    const result = await postCollection.find(query).sort({_id: - 1}).toArray();
    res.send(result);
  })

  app.post('/comment', async(req, res) =>{
    const comment = req.body;
    const result = await commentCollection.insertOne(comment);
    res.send(result);
  })

}
run().catch(err => console.error(err));

app.get('/', (req, res) =>{
  res.send('Bitit server is running successfully');
})

app.listen(port, () =>{
  console.log('Bitit server is running on port: ', port);
})