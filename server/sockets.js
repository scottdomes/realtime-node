import socket from 'socket.io';

export class SocketConnection {
  constructor(server, db) {
    this.db = db;
    this.io = socket(server);
    this.setUpConnection();
  }

  get messages() {
    return this.db
      .collection('messages')
      .find()
      .toArray();
  }

  emitMessages = async (broadcast = false) => {
    const emitter = broadcast ? this.io : this.client;
    emitter.emit('messages', await this.messages);
  };

  handleNewMessage() {
    this.client.on('newMessage', message => {
      this.db
        .collection('messages')
        .insertOne({ text: message }, (err, result) => {
          this.emitMessages(true);
        });
    });
  }

  setUpConnection = () => {
    this.io.on('connection', client => {
      this.client = client;
      emitMessages();
      handleNewMessage();
    });
  };
}

const getMessages = db => {
  return db
    .collection('messages')
    .find()
    .toArray();
};

const emitMessages = async (db, client) => {
  const messages = await getMessages(db);
  client.emit('messages', messages);
};

const handleNewMessage = async (db, client, io) => {
  client.on('newMessage', message => {
    db.collection('messages').insertOne(
      { text: message },
      async (err, result) => {
        io.emit('messages', await getMessages(db));
      }
    );
  });
};

const setUpConnection = (io, db) => {
  io.on('connection', async client => {
    emitMessages(db, client);
    handleNewMessage(db, client, io);
  });
};

export default (server, db) => new SocketConnection(server, db);

// export default (server, db) => {
//   const io = socket(server);
//   setUpConnection(io, db);
// };
