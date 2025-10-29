import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateResume.css";

function CreateResume({ userData, setUserData, setAiRecommendations }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    userData || {
      fullName: "",
      position: "",
      education: "",
      experience: "",
      skills: "",
      achievements: "",
      phone: "",
      email: "",
      location: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateMockRecommendations = (data) => {
    return {
      resumeImprovements: [
        'Добавьте конкретные метрики в описание достижений (например, "увеличил продажи на 30%")',
        "Используйте активные глаголы для описания опыта работы",
        "Структурируйте информацию по принципу от более важного к менее важному",
        "Добавьте ссылки на портфолио или профессиональные социальные сети",
      ],
      skillsDevelopment: [
        "Рекомендуем изучить современные инструменты автоматизации",
        "Обратите внимание на развитие soft skills: коммуникация и работа в команде",
        "Рассмотрите возможность получения профессиональных сертификатов",
        "Участвуйте в профессиональных сообществах и мероприятиях",
      ],
      careerRecommendations: [
        data.position || "Менеджер проектов",
        "Бизнес-аналитик",
        "Руководитель отдела",
        "Консультант",
      ],
      summary: `На основе вашего опыта и навыков, вы имеете сильную базу для позиции ${
        data.position || "специалиста"
      }. Ваши навыки хорошо подходят для карьерного роста в выбранной области.`,
    };
  };

  const validateField = (name, value) => {
    if (!value) return false;

    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "phone":
        return /^[\d\s+()-]+$/.test(value);
      case "fullName":
        return value.length >= 5;
      case "position":
        return value.length >= 3;
      case "education":
      case "experience":
      case "skills":
        return value.length >= 10;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Улучшенная валидация
      const requiredFields = [
        "fullName",
        "position",
        "education",
        "experience",
        "skills",
        "email",
        "phone",
      ];
      const invalidFields = requiredFields.filter(
        (field) => !validateField(field, formData[field])
      );

      if (invalidFields.length > 0) {
        const fieldMessages = {
          email: "Введите корректный email",
          phone: "Введите корректный номер телефона",
          fullName: "ФИО должно содержать не менее 5 символов",
          position: "Должность должна содержать не менее 3 символов",
          education: "Добавьте более подробное описание образования",
          experience: "Добавьте более подробное описание опыта",
          skills: "Укажите больше навыков",
        };

        const errorMessages = invalidFields.map(
          (field) => fieldMessages[field]
        );
        alert(
          "Пожалуйста, исправьте следующие ошибки:\n\n" +
            errorMessages.join("\n")
        );
        setLoading(false);
        return;
      }

      console.log("📤 Отправляем данные на сервер:", formData);

      const apiUrl = `/api/analyze`;
      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const result = await resp.json();

      if (result.error) {
        throw new Error(result.message || "Ошибка при обработке данных");
      }

      // Проверяем структуру ответа
      if (!result.data?.improvedData) {
        throw new Error("Некорректная структура ответа от сервера");
      }

      // Формируем рекомендации для отображения
      setAiRecommendations({
        resumeImprovements: result.data.recommendations || [],
        skillsDevelopment: result.data.skillsDevelopment || [
          "Рекомендуем изучить современные инструменты в вашей области",
          "Развивайте навыки коммуникации и работы в команде",
          "Осваивайте новые технологии и методологии",
          "Получите профессиональные сертификаты",
        ], // Можно добавить из ответа AI, если есть
        careerRecommendations: result.data.careerPaths || [],
        summary: result.data.improvedData.summary || "",
        data: result.data, // Сохраняем все улучшенные данные
      });

      // Обновляем данные пользователя
      setUserData({
        ...formData,
        ...result.data.improvedData,
      });

      // Переходим к выбору шаблона
      navigate("/templates");
    } catch (error) {
      console.error("Ошибка при обработке резюме:", error);

      // Показываем пользователю понятное сообщение об ошибке
      alert(
        "Произошла ошибка при анализе резюме. " +
          "Пожалуйста, проверьте подключение к интернету и попробуйте снова."
      );

      // Устанавливаем базовые рекомендации в случае ошибки
      setAiRecommendations({
        resumeImprovements: [
          "Не удалось получить рекомендации от AI. Попробуйте позже.",
        ],
        skillsDevelopment: [],
        careerRecommendations: [formData.position || "Специалист"],
        summary: "Временно недоступно. Попробуйте обновить страницу.",
        data: {
          improvedData: formData, // Используем оригинальные данные
        },
      });

      // Сохраняем оригинальные данные
      setUserData(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-resume-page">
      <div className="create-content">
        <button className="back-button" onClick={() => navigate("/")}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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

        <div className="glass-card form-card">
          <div className="form-header">
            <h1>Создание резюме</h1>
            <p>Заполните информацию о себе для анализа AI</p>
          </div>

          <form onSubmit={handleSubmit} className="resume-form">
            <div className="form-section">
              <h2>Основная информация</h2>

              <div className="form-group">
                <label htmlFor="fullName">ФИО *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Иванов Иван Иванович"
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Желаемая должность *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  placeholder="Например: Senior Frontend Developer"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ivan@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">Город</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Москва"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Образование</h2>

              <div className="form-group">
                <label htmlFor="education">Образование *</label>
                <textarea
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Укажите учебное заведение, специальность, годы обучения&#10;Например: МГУ, Факультет компьютерных наук, 2015-2019"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Опыт работы</h2>

              <div className="form-group">
                <label htmlFor="experience">Опыт работы *</label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Опишите ваш опыт работы: компания, должность, период, обязанности&#10;Например: Google, Senior Developer, 2020-2023&#10;- Разработка веб-приложений&#10;- Руководство командой из 5 человек"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Навыки и достижения</h2>

              <div className="form-group">
                <label htmlFor="skills">Навыки *</label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Перечислите ваши профессиональные навыки через запятую&#10;Например: JavaScript, React, Node.js, Python, SQL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="achievements">Достижения</label>
                <textarea
                  id="achievements"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Опишите ваши достижения и награды&#10;Например: Победитель хакатона 2022, сертификат AWS Solutions Architect"
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Анализ данных...</span>
                </>
              ) : (
                <>
                  <span>Проанализировать с AI</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateResume;
