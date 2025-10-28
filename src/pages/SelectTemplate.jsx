import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectTemplate.css';

function SelectTemplate({ userData, aiRecommendations, setSelectedTemplate }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  if (!userData || !aiRecommendations?.data) {
    navigate('/create');
    return null;
  }

  const templates = [
    {
      id: 'modern',
      name: 'Современный',
      description: 'Минималистичный дизайн для IT и креативных профессий',
      icon: '💻',
      color: '#4F46E5'
    },
    {
      id: 'professional',
      name: 'Профессиональный',
      description: 'Классический стиль для корпоративных позиций',
      icon: '💼',
      color: '#0891B2'
    },
    {
      id: 'creative',
      name: 'Креативный',
      description: 'Яркий дизайн для маркетинга и дизайна',
      icon: '🎨',
      color: '#EC4899'
    },
    {
      id: 'minimal',
      name: 'Минималистичный',
      description: 'Простой и чистый дизайн',
      icon: '📄',
      color: '#10B981'
    }
  ];

  const handleSelectTemplate = (template) => {
    setSelectedId(template.id);
    setSelectedTemplate(template);
  };

  const handleContinue = () => {
    if (selectedId) {
      navigate('/preview');
    }
  };

  return (
    <div className="select-template-page">
      <div className="select-content">
        <button className="back-button" onClick={() => navigate('/create')}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Назад
        </button>

        <div className="glass-card recommendations-card">
          <div className="recommendations-header">
            <h2>Рекомендации AI</h2>
          </div>

          <div className="recommendations-grid">
            <div className="recommendation-section">
              <h3>Улучшение резюме</h3>
              <ul>
                {aiRecommendations.resumeImprovements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="recommendation-section">
              <h3>Развитие навыков</h3>
              <ul>
                {aiRecommendations.skillsDevelopment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="recommendation-section full-width">
              <h3>Подходящие профессии</h3>
              <div className="career-tags">
                {aiRecommendations.careerRecommendations.map((career, index) => (
                  <span key={index} className="career-tag">{career}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="ai-summary">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p>{aiRecommendations.summary}</p>
          </div>
        </div>

        <div className="glass-card templates-card">
          <div className="templates-header">
            <h1>Выберите шаблон резюме</h1>
            <p>Выберите дизайн, который лучше всего подходит для вашей профессии</p>
          </div>

          <div className="templates-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${selectedId === template.id ? 'selected' : ''}`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="template-icon" style={{ backgroundColor: template.color }}>
                  <span>{template.icon}</span>
                </div>
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                {selectedId === template.id && (
                  <div className="selected-badge">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="continue-button"
            onClick={handleContinue}
            disabled={!selectedId}
          >
            <span>Продолжить</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectTemplate;
