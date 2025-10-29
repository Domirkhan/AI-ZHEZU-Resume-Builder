import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: true, message: "Method Not Allowed" });
    return;
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    res.status(500).json({ error: true, message: "OPENROUTER_API_KEY не найден в переменных окружения" });
    return;
  }

  try {
    const data = req.body;
    if (!data || !data.fullName || !data.position || !data.education || !data.experience || !data.skills) {
      res.status(400).json({ error: true, message: "Не все обязательные поля заполнены" });
      return;
    }

    const prompt = `
Ты — профессиональный HR специалист. Проанализируй и улучш... (оставшаяся часть prompt как в server/index.js)

Текущие данные:
ФИО: ${data.fullName}
Позиция: ${data.position}
Образование: ${data.education}
Опыт работы: ${data.experience}
Навыки: ${data.skills}
${data.achievements ? `Достижения: ${data.achievements}` : ''}

Задача: Переработай резюме, чтобы оно было более профессиональным.
1. Ул... (оставшаяся часть prompt как в server/index.js)

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
        "HTTP-Referer": req.headers.origin || "https://aizhezu-resume-builder.vercel.app",
        "X-Title": "Resume Improver"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      res.status(response.status).json({ error: true, message: `API Error: ${response.status} ${response.statusText}` });
      return;
    }

    const result = await response.json();
    if (!result.choices?.[0]?.message?.content) {
      res.status(500).json({ error: true, message: "Некорректный ответ от API" });
      return;
    }

    try {
      const improvedResume = JSON.parse(result.choices[0].message.content);
      if (!improvedResume.improvedData || !improvedResume.recommendations || !improvedResume.careerPaths) {
        res.status(500).json({ error: true, message: "Отсутствуют обязательные поля в ответе" });
        return;
      }
      if (!improvedResume.improvedData.contacts) {
        improvedResume.improvedData.contacts = {
          email: data.email,
          phone: data.phone,
          location: data.location
        };
      }
      res.status(200).json({
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
      res.status(200).json({ error: true, message: "Ошибка при улучшении резюме", originalData: data });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Внутренняя ошибка сервера", details: error.message });
  }
}
