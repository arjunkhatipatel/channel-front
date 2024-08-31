import Chat from "./component/Chat";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./component/About";
import Login from "./component/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
