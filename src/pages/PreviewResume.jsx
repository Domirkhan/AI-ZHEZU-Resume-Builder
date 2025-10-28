import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import ModernTemplate from '../components/templates/ModernTemplate';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import './PreviewResume.css';

function PreviewResume({ userData, selectedTemplate, aiRecommendations }) {
  const navigate = useNavigate();

  if (!userData || !selectedTemplate) {
    navigate('/create');
    return null;
  }

  // Используем улучшенные данные из AI, если они есть
  const enhancedUserData = {
    ...userData,
    fullName: userData.fullName,
    position: aiRecommendations?.data?.improvedData?.position || userData.position,
    summary: aiRecommendations?.data?.improvedData?.summary || '',
    education: aiRecommendations?.data?.improvedData?.education || userData.education,
    experience: aiRecommendations?.data?.improvedData?.experience || userData.experience,
    skills: aiRecommendations?.data?.improvedData?.skills || userData.skills,
    achievements: aiRecommendations?.data?.improvedData?.achievements || userData.achievements,
    contacts: {
      email: userData.email,
      phone: userData.phone,
      location: userData.location
    }
  };

  const renderTemplate = () => {
    const props = { userData: enhancedUserData };

    switch (selectedTemplate.id) {
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'professional':
        return <ProfessionalTemplate {...props} />;
      case 'creative':
        return <CreativeTemplate {...props} />;
      case 'minimal':
        return <MinimalTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-content');
    
    // Добавляем стили для PDF
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body { margin: 0; padding: 0; }
        .template { max-width: 210mm; margin: 0 auto; }
        .section { page-break-inside: avoid; }
        @page { margin: 0; }
      }
    `;
    document.head.appendChild(style);

    const opt = {
      margin: [0, 0, 0, 0],
      filename: `resume_${enhancedUserData.fullName.replace(/\s+/g, '_')}.pdf`,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        letterRendering: true,
        windowWidth: 1200
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        precision: 16
      }
    };

    // Генерируем PDF
    html2pdf().set(opt).from(element).save().then(() => {
      // Удаляем временные стили после генерации
      document.head.removeChild(style);
    });
  };

  return (
    <div className="preview-page">
      <div className="preview-header">
        <button className="back-button" onClick={() => navigate('/templates')}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M19 12H5m0 0l7 7m-7-7l7-7" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Назад
        </button>

        <div className="header-actions">
          <button className="action-button" onClick={() => navigate('/create')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Редактировать
          </button>

          <button className="download-button" onClick={handleDownloadPDF}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Скачать PDF
          </button>
        </div>
      </div>

      <div className="preview-content">
        <div 
          className="resume-wrapper" 
          id="resume-content"
          style={{ 
            width: '210mm',
            minHeight: '297mm',
            margin: '0 auto',
            background: 'white',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}

export default PreviewResume;