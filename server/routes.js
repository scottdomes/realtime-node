export default function(app, db) {
  app.get('/messages', async (req, res) => {
    const messages = await db.collection('messages').find().toArray()
    res.send({ messages })
  });

  app.post('/messages', (req, res) => {
    const message = { text: req.body.message };
    db.collection('messages').insert(message, (err, result) => {
      if (err) { 
        res.send({ error: 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};