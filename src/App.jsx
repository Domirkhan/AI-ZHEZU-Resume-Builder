import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateResume from './pages/CreateResume';
import SelectTemplate from './pages/SelectTemplate';
import PreviewResume from './pages/PreviewResume';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/create"
          element={
            <CreateResume
              userData={userData}
              setUserData={setUserData}
              setAiRecommendations={setAiRecommendations}
            />
          }
        />
        <Route
          path="/templates"
          element={
            <SelectTemplate
              userData={userData}
              aiRecommendations={aiRecommendations}
              setSelectedTemplate={setSelectedTemplate}
            />
          }
        />
        <Route
          path="/preview"
          element={
            <PreviewResume
              userData={userData}
              selectedTemplate={selectedTemplate}
              aiRecommendations={aiRecommendations}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
