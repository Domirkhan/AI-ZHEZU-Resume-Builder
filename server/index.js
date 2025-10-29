import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors({ origin: 'http://aizhezu-resume-builder.vercel.app'}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("❌ Ошибка: OPENROUTER_API_KEY не найден в .env");
  process.exit(1);
}

app.post("/api/analyze", async (req, res) => {
  try {
    const data = req.body;

    // Валидация входных данных
    if (!data || !data.fullName || !data.position || !data.education || !data.experience || !data.skills) {
      return res.status(400).json({ 
        error: true, 
        message: "Не все обязательные поля заполнены"
      });
    }

    // Формируем промпт для улучшения резюме
    const prompt = `
Ты — профессиональный HR специалист. Проанализируй и улучши следующее резюме, сделав его более привлекательным для работодателей.

Текущие данные:
ФИО: ${data.fullName}
Позиция: ${data.position}
Образование: ${data.education}
Опыт работы: ${data.experience}
Навыки: ${data.skills}
${data.achievements ? `Достижения: ${data.achievements}` : ''}

Задача: Переработай резюме, чтобы оно было более профессиональным.
1. Улучши формулировки в разделе опыта работы
2. Добавь количественные показатели и конкретные достижения
3. Структурируй навыки по категориям
4. Создай привлекательное описание в разделе "О себе"
5. Оптимизируй текст под выбранную должность
6. Пиши всегда на русском языке

Верни ответ в формате JSON:
{
  "improvedData": {
    "fullName": "оригинальное имя",
    "position": "оригинальная или улучшенная позиция",
    "summary": "краткое профессиональное описание",
    "education": "улучшенное описание образования",
    "experience": "улучшенное описание опыта",
    "skills": "структурированные навыки",
    "achievements": "улучшенные достижения",
    "contacts": {
      "email": "оригинальный email",
      "phone": "оригинальный телефон",
      "location": "оригинальный город"
    }
  },
  "recommendations": [
    "рекомендация 1",
    "рекомендация 2",
    "рекомендация 3"
  ],
  "careerPaths": [
    "карьерный путь 1",
    "карьерный путь 2"
  ]
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Resume Improver"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [{ 
          role: "user", 
          content: prompt 
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.choices?.[0]?.message?.content) {
      throw new Error("Некорректный ответ от API");
    }

    try {
      // Парсим и проверяем JSON ответ
      const improvedResume = JSON.parse(result.choices[0].message.content);
      
      // Проверяем наличие всех необходимых полей
      if (!improvedResume.improvedData || !improvedResume.recommendations || !improvedResume.careerPaths) {
        throw new Error("Отсутствуют обязательные поля в ответе");
      }

      // Добавляем оригинальные контакты если они отсутствуют
      if (!improvedResume.improvedData.contacts) {
        improvedResume.improvedData.contacts = {
          email: data.email,
          phone: data.phone,
          location: data.location
        };
      }

      // Возвращаем улучшенное резюме
      res.json({
  success: true,
  data: {
    improvedData: improvedResume.improvedData,
    recommendations: improvedResume.recommendations,
    skillsDevelopment: improvedResume.skillsDevelopment || [
      "Рекомендуем изучить современные инструменты в вашей области",
      "Развивайте навыки коммуникации и работы в команде",
      "Осваивайте новые технологии и методологии",
      "Получите профессиональные сертификаты"
    ],
    careerPaths: improvedResume.careerPaths
  }
});

    } catch (error) {
      console.error("Ошибка обработки ответа:", error);
      // Возвращаем оригинальные данные с пометкой об ошибке
      res.json({
        error: true,
        message: "Ошибка при улучшении резюме",
        originalData: data
      });
    }

  } catch (error) {
    console.error("Ошибка сервера:", error);
    res.status(500).json({
      error: true,
      message: "Внутренняя ошибка сервера",
      details: error.message
    });
  }
});

// Эндпоинт для проверки работоспособности сервера
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`📝 API доступно по адресу: http://localhost:${PORT}`);
});