const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8uogbca.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const taskList = client.db('task-manager').collection('task-to-do');

        app.get('/tasks/:completed', async(req, res) => {
            const completed = req.params.completed;
            const email = req.query.email;
            const query = {completed: completed, email: email};
            const result = await taskList.find(query).toArray();
            res.send(result);
        })

        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await taskList.findOne(query);
            res.send(task);
        })
        
        app.post('/tasks', async(req, res) =>{
            const task = req.body
            const result = await taskList.insertOne(task);
            res.send(result);
        })


        app.delete('/tasks/delete/:id', async (req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await taskList.deleteOne(filter);
            res.send(result);
        } )

        app.put('/tasks/true/:id', async (req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    completed: 'true'
                }
            }
            const result = await taskList.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.put('/tasks/false/:id', async (req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    completed: 'false'
                }
            }
            const result = await taskList.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

    }
    finally{

    }

}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('Task Manager Server is running');
})

app.listen(port, () => console.log('listening on port ' + port));