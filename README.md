# Channel Messaging Frontend

## Overview

This project is the frontend for a real-time messaging service built with React. It provides a user interface for joining channels and exchanging messages in real-time using WebSocket.

## Project Structure

- **`components/`**: Contains reusable React components.
  - **`Chat.js`**: Manages WebSocket connections and state, and conditionally renders either the login or chat view.
- **`assets/`**: Contains static assets like CSS files.

## Installation

### Prerequisites

- Node.js (version 14.x or higher)
- npm (Node Package Manager)

### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/arjunkhatipatel/channel-front.git
   ```

2. **Navigate to the project directory:**

   ```sh
   cd channel-front
   ```

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Start the development server:**

   ```sh
   npm start
   ```

5. **Open your browser and navigate to** `http://localhost:3000` to view the application.

## Configuration

### WebSocket Endpoint

The WebSocket URL is configured in `Chat.js`. By default, it is set to:

```jsx
const ws = new WebSocket("wss://channel-vesh.onrender.com/message");
```
