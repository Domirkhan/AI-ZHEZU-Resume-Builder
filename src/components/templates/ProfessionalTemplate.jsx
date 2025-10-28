import './TemplateStyles.css';

function ProfessionalTemplate({ userData }) {
  const processSkills = (skillsString) => {
    if (typeof skillsString === 'object') {
      return Object.entries(skillsString).map(([category, skills]) => ({
        category,
        skills: Array.isArray(skills) ? skills : [skills]
      }));
    }
    
    try {
      const parsed = JSON.parse(skillsString);
      if (typeof parsed === 'object') {
        return Object.entries(parsed).map(([category, skills]) => ({
          category,
          skills: Array.isArray(skills) ? skills : [skills]
        }));
      }
    } catch {
      const skills = skillsString.split(',').map(s => s.trim()).filter(Boolean);
      return [{
        category: 'Навыки',
        skills
      }];
    }
  };

  const skillsData = processSkills(userData.skills);

  const formatExperience = (experience) => {
    if (!experience) return [];
    
    try {
      const parsed = JSON.parse(experience);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [{ description: experience }];
    }
  };

  const experienceData = formatExperience(userData.experience);

  return (
    <div className="template professional-template">
      <div className="template-sidebar professional-sidebar">
        <div className="sidebar-section">
          <h3>Контакты</h3>
          <div className="contact-item">
            <strong>Email:</strong>
            <span>{userData.email}</span>
          </div>
          <div className="contact-item">
            <strong>Телефон:</strong>
            <span>{userData.phone}</span>
          </div>
          {userData.location && (
            <div className="contact-item">
              <strong>Город:</strong>
              <span>{userData.location}</span>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <h3>Навыки</h3>
          <div className="skills-list">
            {skillsData.map((skillGroup) => (
              <div key={skillGroup.category}>
                {skillGroup.category !== 'Навыки' && (
                  <strong className="skill-category">{skillGroup.category}</strong>
                )}
                {skillGroup.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="template-main professional-main">
        <div className="main-header">
          <h1 className="name">{userData.fullName}</h1>
          <h2 className="position">{userData.position}</h2>
        </div>

        {userData.summary && (
          <section className="section">
            <h3 className="section-title">О себе</h3>
            <div className="section-content">
              <p className="text-content">{userData.summary}</p>
            </div>
          </section>
        )}

        <section className="section">
          <h3 className="section-title">Образование</h3>
          <div className="section-content">
            <p className="text-content">{userData.education}</p>
          </div>
        </section>

        <section className="section">
          <h3 className="section-title">Опыт работы</h3>
          <div className="section-content">
            {experienceData.map((exp, index) => (
              <div key={index} className="experience-item">
                {exp.company && <h4 className="company-name">{exp.company}</h4>}
                {exp.position && <h5 className="position-title">{exp.position}</h5>}
                {exp.period && <p className="period">{exp.period}</p>}
                <p className="text-content preserve-lines">
                  {exp.description || exp}
                </p>
              </div>
            ))}
          </div>
        </section>

        {userData.achievements && (
          <section className="section">
            <h3 className="section-title">Достижения</h3>
            <div className="section-content">
              {Array.isArray(userData.achievements) ? (
                <ul className="achievements-list">
                  {userData.achievements.map((achievement, index) => (
                    <li key={index} className="achievement-item">
                      {achievement}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-content preserve-lines">
                  {userData.achievements}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProfessionalTemplate;