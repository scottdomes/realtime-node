import express from 'express';
import { MongoClient } from 'mongodb'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes'

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors())

MongoClient.connect(
  'mongodb://localhost/realtime',
  (err, database) => {
    if (err) return console.log(err);
    const db = database.db('realtime');
    routes(app, db)


    const server = app.listen(8080, () => {
      console.log('Listening at port', server.address().port);
    });
  }
);
