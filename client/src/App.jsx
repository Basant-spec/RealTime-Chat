import './App.css'
import { useState, useEffect, useMemo } from 'react' 
import { io } from "socket.io-client";

function App() {
  const [messages, setmessages] = useState([])
  const socket = useMemo(()=> io("http://localhost:3000"), [])
  const [socketid, setsocketid] = useState("")
  const [reciever, setreciever] = useState("")
  const [room, setroom] = useState("")

  const joinRoom = (e)=>{
    e.preventDefault();

    if(room !==""){
      socket.emit("join_room", room);
      console.log("Joined room: "+ room);
    }
  }

  useEffect(()=>{
    socket.on('connect', ()=>{
      console.log("Connected to server", socket);
      setsocketid(socket.id)
    })

    socket.on('message',(msg)=>{
      setmessages((prev)=>[...prev, msg])
      console.log("Message from server: "+ msg);
    })

    return ()=>{
      socket.off('connect')
      socket.off('message')
      socket.disconnect()
      console.log("Socket disconnected");
    }
  }, [socket])


  const [message, setMessage] = useState("")

  const handleSubmit= (e)=>{
    e.preventDefault();
    
    const data = {
      message,
      reciever
    }
    socket.emit("message", data);
    setmessages((prev) => [...prev, { message, sender: true }]); // Add sent message locally
    setMessage("")
  }

  return (
    <div style={styles.container}>
          <h1 style={styles.header}>Welcome to the RealChat App</h1>
          <p style={styles.socketId}>Socket ID: {socketid}</p>
        <div style={styles.messagesContainer}>
        {messages.map((msg, i) => (
          <div 
            key={i} 
            style={{
              ...styles.message,
              alignSelf: msg.sender ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender ? '#DCF8C6' : '#FFFFFF',
            }}
          >
            {msg.message || msg}
          </div>
        ))}
      </div>
  

      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          type="text" 
          onChange={(e)=>setMessage(e.target.value)}  
          placeholder='Write Your Message'
          value={message}
          style={styles.input}
        />
        <input 
          type="text"
          placeholder='Receiver Socket ID'
          onChange={(e)=>setreciever(e.target.value)}
          value={reciever}
          style={styles.input}
        />
        <button type='submit' style={styles.button}>Send</button>
      </form>


      <form style={styles.form} onSubmit={joinRoom}>
        <input
          type="text"
          style={styles.input}
          placeholder='Room Name'
          onChange={(e) => setroom(e.target.value)}
          value={room}
          />
        <button type='submit' style={styles.button}>Join Room</button>
      </form>

    
    </div>
  )
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  socketId: {
    textAlign: 'center',
    color: '#555',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    width: '100%',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  message: {
    maxWidth: '70%',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    wordWrap: 'break-word',
  },
};

export default App
