const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bitit server is running successfully');
})

const uri = `mongodb+srv://${process.env.BITIT_MONGO_USER_DB}:${process.env.BITIT_USER_PASS}@cluster0.rencz4l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {

    const postCollection = client.db("bitit_DB_user").collection('posts');
    const commentCollection = client.db("bitit_DB_user").collection('comments');
    const usersCollection = client.db("bitit_DB_user").collection('users');


    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user?.email }
      const alreadyExist = await usersCollection.find(query).toArray();
      if (alreadyExist.length) {
        return res.send({ acknowledged: false })
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    app.get('/users', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    })

    app.put('/users', async (req, res) => {
      const data = req.body;
      const filter = { email: data?.email };
      const updatedDoc = {
        $set: {
          address: data?.address,
          university: data?.university
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    app.post('/posts', async (req, res) => {
      const postData = req.body;
      const result = await postCollection.insertOne(postData);
      res.send(result);
    })

    app.get('/posts', async (req, res) => {
      const query = {};
      const result = await postCollection.find(query).sort({ _id: - 1 }).toArray();
      res.send(result);
    })

    app.post('/comment', async (req, res) => {
      const comment = req.body;
      const filter = { _id: ObjectId(comment.post_id) };
      const filterResult = await postCollection.findOne(filter);

      if (filterResult) {

        let commentCount = filterResult?.post_comment;
        const updatedDoc = {
          $set: {
            post_comment: commentCount + 1
          }
        }

        const updateResult = await postCollection.updateOne(filter, updatedDoc);
        const result = await commentCollection.insertOne(comment);
        res.send(result);
      }
    })


    app.get('/comment', async (req, res) => {
      const postId = req.query.post_id;
      const query = { post_id: postId };
      const result = await commentCollection.find(query).toArray();
      res.send(result);
    })

    app.put('/post-like/:id', async (req, res) => {
      const id = req.params.id;
      const count = req.body;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          post_like: count?.likeReactCount
        }
      }
      const result = await postCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

  }
  finally {

  }
}
run().catch(err => console.error(err));



app.listen(port, () => {
  console.log('Bitit server is running on port: ', port);
})