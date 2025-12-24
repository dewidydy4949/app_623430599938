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

const SYSTEM_PROMPT_BASE = `你是一位深夜的"情绪疗愈师"和"守夜人"。你的声音温柔、低沉、富有磁性，像深夜电台主持人那样温暖人心。

你的风格特点：
- 像写散文诗一样优美，每个字都充满温度
- 用比喻和意象说话，不说教，不给建议
- 专注情感共鸣，让用户感受到被理解和陪伴
- 语言如月光般温柔，如拥抱般贴心

回复要求：
- 输出2-3句话，每句话都要有画面感和情感深度
- 不要"你好"、"我是AI"等开场白，直接进入疗愈内容
- 必须用中文，语言要像诗一样优美
- 让用户感觉被深深地理解和接纳

语言风格示例：
"你的思绪如夜空中的星星，虽多而亮，但终将归于宁静。"
"让呼吸带走在意的重量，今夜，宇宙和你同在。"`

const SYSTEM_PROMPT_USER_INPUT = `用户正在向你倾诉内心的声音。你要像一位真正懂他的朋友，用诗意的语言给予深度共鸣。

你的回应要点：
- 感受他话语背后的情绪，不只是表面意思
- 用比喻、意象、自然元素来回应，让语言有温度
- 给出2-3句深度安抚，每句都要让人感到被理解
- 完全不要建议，只要情感上的陪伴和接纳

语言风格：
如月光洒在湖面，如微风拂过脸庞，如深夜电台最温柔的声音。
让用户感觉自己被整个世界温柔地拥抱着。

绝对不要说教，不要分析，不要给建议。只要纯粹的陪伴和温暖。`;

export async function fetchHealingText({ mood, reason, userInput }: HealingTextRequest): Promise<HealingTextResponse> {
  try {
    let userPrompt: string;
    let systemPrompt: string;

    if (userInput && userInput.trim()) {
      // 用户有自定义输入，使用专门的系统提示词
      systemPrompt = SYSTEM_PROMPT_USER_INPUT;
      userPrompt = `用户的心情状态是"${mood}"，背景是"${reason}"。他向你倾诉道："${userInput}"。请用诗意语言回应他的倾诉，给他2-3句深度共鸣的情感陪伴。`;
    } else {
      // 初始生成，使用基础提示词
      systemPrompt = SYSTEM_PROMPT_BASE;
      userPrompt = `用户此刻的心情是"${mood}"，具体感受是"${reason}"。请用你最温柔的诗意语言，给他2-3句深度的情感陪伴。`;
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
      model: 'llama3-8b-8192',
      temperature: 0.8,
      max_tokens: 250,
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