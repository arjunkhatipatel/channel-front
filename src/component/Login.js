import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../assets/Login.css";
import "../assets/utils.css";
import { Link } from "react-router-dom";
import Chat from "./Chat";

const Login = () => {
  const [login, setLogin] = useState(false);
  const [channel, setChannel] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const countdownRef = useRef(null);

  useEffect(() => {
    // Send wakeup request
    const wakeupServer = () => {
      axios
        .get("http://192.168.1.21:8080/api/wakeup")
        .then((response) => {
          if (response.data.msg) {
          }
        })
        .catch((error) => {});
    };

    wakeupServer();
    const timer = setInterval(wakeupServer, 20000); // Retry every 30 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loading && countdown !== null) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(countdownRef.current);
            setLoading(false); // Reset loading here
            handleLogin(); // Automatically trigger login when countdown ends
            return null;
          }
        });
      }, 1000);
    }

    // Clear interval when component unmounts or countdown completes
    return () => clearInterval(countdownRef.current);
  }, [loading, countdown]);

  const handleLogin = () => {
    if (
      channel.trim() !== "" &&
      username.trim() !== "" &&
      password.trim() !== ""
    ) {
      const loginJson = JSON.stringify({ channel, username, password });
      axios
        .post("http://192.168.1.21:8080/api/login", loginJson, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data.body) {
            setLoading(false);
            setRetrying(false);
            setSessionId(response.data.body);
            setLogin(true);
          } else {
            handleError(response);
          }
        })
        .catch((error) => {
          handleError(error.response);
        });
    } else {
      alert("Please enter channel and username");
    }
  };

  const handleError = (response) => {
    if (response.status === 409) {
      setError("Username already taken, please choose another.");
    } else if (response.status === 401) {
      setError("Incorrect password.");
    } else {
      setError("Server error. Retrying...");
      if (!retrying) {
        setRetrying(true);
        setTimeout(() => {
          setRetrying(false);
          handleLogin();
        }, 15000); // Retry after 30 seconds
      }
    }
  };

  const startCountdown = () => {
    setCountdown(Math.floor(Math.random() * 11)); // Random number between 25 and 35
    setLoading(true);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (
      channel.trim() !== "" &&
      username.trim() !== "" &&
      password.trim() !== ""
    ) {
      startCountdown();
    } else {
      alert("Please enter channel and username");
    }
  };

  const handleLogout = () => {
    setLogin(false);
    setSessionId("");
  };

  return (
    <div className="container">
      {login ? (
        <Chat sessionId={sessionId} onLogout={handleLogout} />
      ) : (
        <>
          {loading && countdown !== null ? (
            <div>
              We are creating your channel. Please wait... {countdown} Seconds
            </div>
          ) : (
            <div className="login-container">
              {error && <div className="error-message">{error}</div>}
              <input
                type="text"
                placeholder="Channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && window.innerWidth >= 768) {
                    e.preventDefault();
                    handleLoginClick(e);
                  }
                }}
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && window.innerWidth >= 768) {
                    e.preventDefault();
                    handleLoginClick(e);
                  }
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && window.innerWidth >= 768) {
                    e.preventDefault();
                    handleLoginClick(e);
                  }
                }}
              />
              <button onClick={handleLoginClick}>Login</button>
              <Link to="/about" className="about-link">
                About Us
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Login;
