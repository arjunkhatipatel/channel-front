import React from "react";
import { motion } from "framer-motion";
import "../assets/About.css";

const About = () => {
  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="about-title">About Channel Messaging App</h1>
      <p className="about-description">
        Welcome to the Channel Messaging App, a secure and anonymous real-time
        messaging platform. Your privacy is our top priority; all messages are
        destroyed as soon as users leave the channel, ensuring that no one can
        access them.
      </p>
      <p className="about-description">
        This website is owned and operated by Swastik Media Pvt Ltd, under the
        leadership of{" "}
        <a
          href="https://arjunpatel.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="about-link"
        >
          Arjun Patel
        </a>
        .
      </p>
      <h2 className="about-subtitle">Features</h2>
      <ul className="about-features">
        <li>- Anonymous chat rooms</li>
        <li>- Real-time messaging with WebSocket</li>
        <li>- Secure message destruction upon leaving the channel</li>
        <li>- Responsive design for both mobile and desktop</li>
        <li>- Minimalistic and aesthetic UI/UX</li>
      </ul>
      <h2 className="about-subtitle">How to Use</h2>
      <p className="about-description">
        To start chatting, simply enter a channel name and your preferred
        username. Once inside, you can send and receive messages in real-time.
        Remember, all messages are deleted once you exit the channel, keeping
        your conversations private.
      </p>
    </motion.div>
  );
};

export default About;
