// Vercel serverless function for /api/analyze
// Expects OPENROUTER_API_KEY to be set in Vercel environment variables

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: true, message: 'Method Not Allowed' });
    }

    const data = req.body;

    // Basic validation
    if (!data || !data.fullName || !data.position || !data.education || !data.experience || !data.skills) {
      return res.status(400).json({ error: true, message: 'Не все обязательные поля заполнены' });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not set');
      return res.status(500).json({ error: true, message: 'Server configuration error' });
    }

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

    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!apiResponse.ok) {
      const text = await apiResponse.text();
      console.error('OpenRouter API error', apiResponse.status, text);
      return res.status(502).json({ error: true, message: 'Upstream API error', status: apiResponse.status, details: text });
    }

    const result = await apiResponse.json();

    // Try different locations for the model's output
    let rawContent = '';
    if (result.choices?.[0]?.message?.content) rawContent = result.choices[0].message.content;
    else if (result.choices?.[0]?.text) rawContent = result.choices[0].text;
    else if (result.output_text) rawContent = result.output_text;

    let improvedResume;
    // First try direct JSON parse
    try {
      improvedResume = JSON.parse(rawContent);
    } catch (err) {
      // If direct parse failed, try to extract a JSON object substring from the text
      try {
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          improvedResume = JSON.parse(jsonMatch[0]);
        } else {
          console.warn('No JSON found in AI response. Returning raw content for debugging.');
          console.error('Raw AI response:', rawContent);
          return res.status(500).json({ error: true, message: 'Invalid AI response format', raw: rawContent });
        }
      } catch (err2) {
        console.error('Failed to extract/parse JSON from AI response', err2, rawContent);
        return res.status(500).json({ error: true, message: 'Invalid AI response format', parseError: err2.message, raw: rawContent });
      }
    }

    // Ensure contacts exist
    if (!improvedResume.improvedData.contacts) {
      improvedResume.improvedData.contacts = {
        email: data.email,
        phone: data.phone,
        location: data.location
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        improvedData: improvedResume.improvedData,
        recommendations: improvedResume.recommendations || [],
        skillsDevelopment: improvedResume.skillsDevelopment || [
          'Рекомендуем изучить современные инструменты в вашей области',
          'Развивайте навыки коммуникации и работы в команде',
          'Осваивайте новые технологии и методологии',
          'Получите профессиональные сертификаты'
        ],
        careerPaths: improvedResume.careerPaths || []
      }
    });

  } catch (error) {
    console.error('Serverless analyze error', error);
    return res.status(500).json({ error: true, message: 'Internal server error', details: error.message });
  }
}
