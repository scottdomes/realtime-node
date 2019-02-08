import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from 'http';
import setUpSockets from './sockets';

const app = express();
app.use(bodyParser.json());
app.use(cors());
const server = createServer(app);

MongoClient.connect('mongodb://localhost/realtime', (err, database) => {
  if (err) return console.log(err);
  const db = database.db('realtime');
  setUpSockets(server, db);

  server.listen(8080, () => {
    console.log('Listening at port', server.address().port);
  });
});
