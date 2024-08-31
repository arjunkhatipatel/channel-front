import React, { useEffect, useState } from "react";
import "../assets/Chat.css";
import "../assets/utils.css";

const Chat = ({ sessionId, onLogout }) => {
  const [msgList, setMsgList] = useState([]);
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");
  const [first, setFirst] = useState("first");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(
      // `wss://192.168.1.21:8080/message?sessionId=${sessionId}`
      `ws://192.168.1.21:8080/message`
    );

    ws.onopen = () => {
      setError("");
      // ws.send(sessionId);
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
  }, [sessionId]);

  const sendMsg = (e) => {
    e.preventDefault();
    if (msg.trim() !== "") {
      const message = JSON.stringify({ type: first, msg, sessionId });
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        setMsg("");

        if (count === 0) {
          setFirst("msg");
          setCount(count + 1);
        }
      } else {
        setError("Connection not open. Please wait or try again.");
      }
    } else {
      alert("Please enter a message");
    }
  };

  return (
    <div className="container">
      {error && <div className="error-message">{error}</div>}
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
            onChange={(e) => setMsg(e.target.value)}
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
      {/* <button onClick={onLogout} className="logout-button">
        Logout
      </button> */}
    </div>
  );
};

export default Chat;
