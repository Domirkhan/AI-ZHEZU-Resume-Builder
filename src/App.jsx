import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CreateResume from "./pages/CreateResume";
import SelectTemplate from "./pages/SelectTemplate";
import PreviewResume from "./pages/PreviewResume";
import "./App.css";

function App() {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const [aiRecommendations, setAiRecommendations] = useState(() => {
    const saved = localStorage.getItem("aiRecommendations");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const saved = localStorage.getItem("selectedTemplate");
    return saved ? JSON.parse(saved) : null;
  });

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    if (userData) localStorage.setItem("userData", JSON.stringify(userData));
    if (aiRecommendations)
      localStorage.setItem(
        "aiRecommendations",
        JSON.stringify(aiRecommendations)
      );
    if (selectedTemplate)
      localStorage.setItem(
        "selectedTemplate",
        JSON.stringify(selectedTemplate)
      );
  }, [userData, aiRecommendations, selectedTemplate]);

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
            userData ? (
              <SelectTemplate
                userData={userData}
                aiRecommendations={aiRecommendations}
                setSelectedTemplate={setSelectedTemplate}
              />
            ) : (
              <Navigate to="/create" replace />
            )
          }
        />
        <Route
          path="/preview"
          element={
            userData && selectedTemplate ? (
              <PreviewResume
                userData={userData}
                selectedTemplate={selectedTemplate}
                aiRecommendations={aiRecommendations}
              />
            ) : (
              <Navigate to="/create" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
