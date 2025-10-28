import './TemplateStyles.css';

function CreativeTemplate({ userData }) {
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
    <div className="template creative-template">
      <div className="template-header creative-header">
        <div className="header-content">
          <h1 className="name">{userData.fullName}</h1>
          <h2 className="position">{userData.position}</h2>
        </div>
        <div className="header-decoration"></div>
      </div>

      <div className="template-content creative-content">
        <div className="contact-bar">
          <div className="contact-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {userData.email}
          </div>
          <div className="contact-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {userData.phone}
          </div>
          {userData.location && (
            <div className="contact-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {userData.location}
            </div>
          )}
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
            <p className="text-content preserve-lines">{userData.education}</p>
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

        <section className="section">
          <h3 className="section-title">Навыки</h3>
          <div className="skills-content">
            {skillsData.map((skillGroup, groupIndex) => (
              <div key={groupIndex} className="skill-group">
                {skillGroup.category !== 'Навыки' && (
                  <h4 className="skill-category">{skillGroup.category}</h4>
                )}
                <div className="skills-grid">
                  {skillGroup.skills.map((skill, index) => (
                    <span key={index} className="skill-tag creative-skill">
                      {skill}
                    </span>
                  ))}
                </div>
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

export default CreativeTemplate;