import express from 'express';
import { MongoClient } from 'mongodb'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createServer } from 'http'
import socket from 'socket.io'
import routes from './routes'

const app = express();
app.use(bodyParser.json());
app.use(cors())
const server = createServer(app);



MongoClient.connect(
  'mongodb://localhost/realtime',
  (err, database) => {
    if (err) return console.log(err);
    const db = database.db('realtime');
    routes(app, db)
    const io = socket(server)

    io.on('connection', async (client) => {
      console.log('connection!')
      const messages = await db.collection('messages').find().toArray()
      client.emit('messages', messages)
      client.on('newMessage', message => { 
        db.collection('messages').insert({ text: message }, async (err, result) => {
          io.emit('messages', await db.collection('messages').find().toArray())
        });
      });
      client.on('disconnect', () => { console.log('disconnect!') });
    });

    server.listen(8080, () => {
      console.log('Listening at port', server.address().port);
    });
  }
);
