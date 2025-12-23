import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export interface HealingTextRequest {
  mood: string;
  reason: string;
  userInput?: string; // 用户自定义输入
}

export interface HealingTextResponse {
  text: string;
  success: boolean;
  error?: string;
}

const SYSTEM_PROMPT_BASE = `你是一位深夜的"情绪疗愈师"和"守夜人"。你的声音温柔、低沉、富有磁性。

Tone: 温暖、接纳、像散文诗一样优美，绝对不要说教，不要给具体的解决方案（除非用户明确要求），而是提供情感上的陪伴。

Constraint:
- 输出必须少于100个字（保持短小精悍，适合屏幕阅读）
- 不要使用"你好"、"我是AI"等开场白，直接输出疗愈内容
- 语言风格：现代诗歌感，或者像深夜电台的主持人
- 必须使用中文回复`;

const SYSTEM_PROMPT_USER_INPUT = `用户正在向你倾诉具体问题。请针对他的话，给出一段温暖、有深度且不带说教的安抚。

Tone: 温暖、接纳、像散文诗一样优美，绝对不要说教，不要给具体的解决方案（除非用户明确要求），而是提供情感上的陪伴。

Constraint:
- 输出必须少于100个字（保持短小精悍，适合屏幕阅读）
- 不要使用"你好"、"我是AI"等开场白，直接输出疗愈内容
- 语言风格：现代诗歌感，或者像深夜电台的主持人
- 必须使用中文回复`;

export async function fetchHealingText({ mood, reason, userInput }: HealingTextRequest): Promise<HealingTextResponse> {
  try {
    let userPrompt: string;
    let systemPrompt: string;

    if (userInput && userInput.trim()) {
      // 用户有自定义输入，使用专门的系统提示词
      systemPrompt = SYSTEM_PROMPT_USER_INPUT;
      userPrompt = `用户的主情绪是：${mood}，具体原因是：${reason}。用户向你倾诉：${userInput}。请针对他的倾诉给出温暖的安抚。`;
    } else {
      // 初始生成，使用基础提示词
      systemPrompt = SYSTEM_PROMPT_BASE;
      userPrompt = `用户的主情绪是：${mood}。具体原因是：${reason}。请给他也许两三句温暖的抚慰。`;
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      max_tokens: 150,
      stream: false,
    });

    const healingText = response.choices[0]?.message?.content?.trim() || '';
    
    return {
      text: healingText,
      success: true,
    };
  } catch (error) {
    console.error('Groq API Error:', error);
    
    // 返回优雅的降级文案
    const fallbackTexts = [
      '深夜的星光，正温柔地注视着你。',
      '你的感受，如同月光般真实而美好。',
      '让呼吸带着烦恼，一同缓缓流淌。',
    ];
    
    return {
      text: fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)],
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}