import React, { Component } from 'react';

import './App.css';

class App extends Component {
  state = { messages: [], newMessage: '' }

  componentDidMount() {
    const { socket } = this.props
    socket.on('messages', messages => {
      this.setState({ messages })
    })
  }

  handleNewMessageChange = e => {
    this.setState({ newMessage: e.target.value })
  }

  loadMessages() {
   fetch('http://localhost:8080/messages')
      .then(res => res.json())
      .then(data => {
        this.setState({ messages: data.messages})
      })
  }

  sendMessage = () => {
    // const payload = JSON.stringify({
    //     message: this.state.newMessage
    //   })
    // fetch('http://localhost:8080/messages', { 
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: payload
    // }).then(() => {
    //   this.setState({ newMessage: '' })
    //   this.loadMessages()
    // })
    this.props.socket.emit('newMessage', this.state.newMessage)
  }

  render() {
    const { messages, newMessage } = this.state
    return (
      <div className="App">
        {
          messages.map(msg => <p key={msg._id}>{msg.text}</p>)
        }
        <textarea 
          value={newMessage} 
          onChange={this.handleNewMessageChange} 
        />
        <button onClick={this.sendMessage}>Send</button>
      </div>
    );
  }
}

export default App;
