import React, { useEffect, useState } from "react";
import "../assets/Chat.css";
import "../assets/utils.css";
import "../assets/Login.css";

const Chat = () => {
  const [login, setLogin] = useState(false);
  const [channel, setChannel] = useState("");
  const [name, setName] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // const ws = new WebSocket("wss://channel-vesh.onrender.com/message");
    const ws = new WebSocket("http://192.168.1.21:8080/message");

    ws.onopen = () => {
      setError("");
    };

    ws.onmessage = (event) => {
      setMsgList((prevMsgList) => [...prevMsgList, event.data]);
    };

    ws.onclose = (event) => {
      if (!event.wasClean) {
        setError("Connection lost. Server might be down.");
      } else {
        console.log("WebSocket connection closed cleanly");
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const onLogin = (e) => {
    e.preventDefault();
    if (channel.trim() !== "" && name.trim() !== "") {
      const loginMessage = JSON.stringify({ type: "login", channel, name });
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(loginMessage);
        setLogin(true);
      } else {
        setError("Connection not open. Please wait or try again.");
      }
    } else {
      alert("Please enter channel and name");
    }
  };

  const sendMsg = (e) => {
    e.preventDefault();
    if (msg.trim() !== "") {
      const message = JSON.stringify({ type: "msg", channel, name, msg });
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        setMsg("");
      } else {
        setError("Connection not open. Please wait or try again.");
      }
    } else {
      alert("Please enter message");
    }
  };

  return (
    <div className="container">
      {error && <div className="error-message">{error}</div>}
      {login ? (
        <div className="chat-container">
          <div className="message-list">
            {msgList.length > 0 ? (
              msgList.map((m, i) => (
                <div key={i} className="message">
                  {m}
                </div>
              ))
            ) : (
              <div className="no-messages">No messages at this time</div>
            )}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && window.innerWidth >= 768) {
                  e.preventDefault();
                  sendMsg(e);
                }
              }}
            />
            <button onClick={sendMsg}>Send</button>
          </div>
        </div>
      ) : (
        <div className="login-container">
          <input
            type="text"
            placeholder="Channel"
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && window.innerWidth >= 768) {
                e.preventDefault();
                onLogin(e);
              }
            }}
          />
          <button onClick={onLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
