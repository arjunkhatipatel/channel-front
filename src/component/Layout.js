import React, { useEffect, useState } from "react";

const Layout = () => {
  const [login, setLogin] = useState(false);
  const [channel, setChannel] = useState("");
  const [name, setName] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.1.19:8080/message");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setError("");
    };

    ws.onmessage = (event) => {
      setMsgList((prevMsgList) => [...prevMsgList, event.data]);
    };

    ws.onclose = (event) => {
      if (!event.wasClean) {
        console.error("WebSocket connection closed unexpectedly:", event);
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
    <>
      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          {error}
        </div>
      )}
      {login ? (
        <div
          className="chat"
          style={{ margin: "10px auto", width: "max-content" }}
        >
          <ul style={{ padding: "0" }}>
            {msgList.length > 0
              ? msgList.map((m, i) => <li key={i}>{m}</li>)
              : "No message at this time"}
          </ul>
          <br />
          <input
            type="text"
            name="msg"
            id="msg"
            placeholder="Message"
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          />
          <br />
          <input type="button" value="Send" onClick={sendMsg} />
        </div>
      ) : (
        <div
          className="login"
          style={{ margin: "10px auto", width: "max-content" }}
        >
          <input
            type="text"
            name="channel"
            id="channel"
            placeholder="Channel"
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value);
            }}
          />
          <br />
          <input
            type="text"
            name="name"
            placeholder="Name"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <br />
          <input type="button" value="Login" onClick={onLogin} />
        </div>
      )}
    </>
  );
};

export default Layout;
