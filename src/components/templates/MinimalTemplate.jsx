import './TemplateStyles.css';

function MinimalTemplate({ userData }) {
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
    <div className="template minimal-template">
      <div className="template-header minimal-header">
        <h1 className="name">{userData.fullName}</h1>
        <h2 className="position">{userData.position}</h2>
        <div className="minimal-contacts">
          {userData.email} | {userData.phone}
          {userData.location && ` | ${userData.location}`}
        </div>
      </div>

      <div className="template-content minimal-content">
        {userData.summary && (
          <section className="section">
            <h3 className="section-title minimal-title">О себе</h3>
            <div className="section-content">
              <p className="text-content">{userData.summary}</p>
            </div>
          </section>
        )}

        <section className="section">
          <h3 className="section-title minimal-title">Образование</h3>
          <div className="section-content">
            <p className="text-content preserve-lines">{userData.education}</p>
          </div>
        </section>

        <section className="section">
          <h3 className="section-title minimal-title">Опыт работы</h3>
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
          <h3 className="section-title minimal-title">Навыки</h3>
          <div className="skills-content">
            {skillsData.map((skillGroup, groupIndex) => (
              <div key={groupIndex} className="skill-group">
                {skillGroup.category !== 'Навыки' && (
                  <h4 className="skill-category">{skillGroup.category}</h4>
                )}
                <div className="skills-grid">
                  {skillGroup.skills.map((skill, index) => (
                    <span key={index} className="skill-tag minimal-skill">
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
            <h3 className="section-title minimal-title">Достижения</h3>
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

export default MinimalTemplate;