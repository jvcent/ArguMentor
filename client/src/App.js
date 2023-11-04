import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from './pages/Landing';
import { Input } from './pages/Input';
import { Chat } from './pages/Chat';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Input />} />
          <Route path="/input" element={<Input />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
