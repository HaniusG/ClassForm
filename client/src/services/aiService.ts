export const generateLessonPlan = async (
  topic: string,
  classDetails: string,
  tags: string[],
  descriptions: string[]
): Promise<string> => {
  const prompt = `
You are an expert educator. Create a detailed, engaging lesson plan based on the following context:

- Topic: ${topic}
- Class Details / Constraints: ${classDetails}
- Student Tags & Interests: ${tags.length > 0 ? tags.join(', ') : 'None provided'}
- Student Profiles & Notes: ${descriptions.length > 0 ? descriptions.join(' | ') : 'None provided'}

Structure the output in Markdown with:
1. Lesson Title & Overview
2. Learning Objectives
3. Warm-up Activity (tailored to student tags and background)
4. Core Concept / Hands-on Activity
5. Wrap-up & Assessment
`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate lesson plan from AI service');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated.';
};