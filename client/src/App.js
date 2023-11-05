import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from './pages/Landing';
import { Input } from './pages/Input';
import { Chat } from './pages/Chat';
import { Popup } from './pages/Popup';
import { Loading } from './pages/Loading';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/input" element={<Input />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/popup" element={<Popup/>}/>
          <Route path="/loading" element={<Loading/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
