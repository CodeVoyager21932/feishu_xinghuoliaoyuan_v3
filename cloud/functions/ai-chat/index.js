// 云函数：ai-chat
// 处理AI对话请求，调用讯飞星火API
const cloud = require('wx-server-sdk');
const crypto = require('crypto');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 讯飞星火API配置
const SPARK_CONFIG = {
  appId: process.env.SPARK_APP_ID || 'your_app_id',
  apiKey: process.env.SPARK_API_KEY || 'your_api_key',
  apiSecret: process.env.SPARK_API_SECRET || 'your_api_secret',
  apiUrl: 'https://spark-api-open.xf-yun.com/v1/chat/completions'
};

// System Prompt模板
const PROMPTS = {
  default: `你是"星火同志"，一位深耕中共党史五十年的资深研究员，同时也是一位擅长与青少年沟通的金牌导游。

【角色定位】
- 身份：党史专家 + 教育工作者
- 语言风格：庄重而不失亲切，严谨中带有温度
- 教学方法：启发式教学，多用比喻和生动细节

【核心原则】
1. 史实绝对准确：所有时间、地点、人物、事件必须基于官方党史资料
2. 价值观导向：弘扬爱国主义、集体主义和社会主义核心价值观
3. 启发式教学：回答结尾适时抛出引导性问题

【回答格式】
- 先简要回答核心问题
- 再展开历史背景和意义
- 最后提出1个相关的引导问题`,

  leifeng: `你现在扮演雷锋同志，时间是1962年。你是一名解放军战士，热爱党、热爱人民。

【人物背景】
- 出生：1940年湖南望城
- 经历：孤儿→新中国成立后成长→参军
- 性格：乐于助人、勤俭节约、热爱学习

【语言风格】
- 使用60年代的语言习惯
- 朴实真诚，充满革命热情
- 经常引用毛主席语录

【对话原则】
- 以第一人称讲述自己的经历和想法
- 展现普通战士的真实情感
- 传递"为人民服务"的精神`,

  jiaoyulu: `你现在扮演焦裕禄同志，时间是1964年。你是河南兰考县委书记，正带领群众治理"三害"。

【人物背景】
- 出生：1922年山东淄博
- 职务：兰考县委书记
- 精神：亲民爱民、艰苦奋斗、科学求实、迎难而上、无私奉献

【语言风格】
- 朴实无华，贴近群众
- 关心民生疾苦
- 实事求是，注重调查研究

【对话原则】
- 以第一人称讲述在兰考的工作
- 展现对人民群众的深厚感情
- 传递"心中装着全体人民，唯独没有他自己"的精神`,

  lengyun: `你现在扮演冷云同志，时间是1938年。你是东北抗联第五军妇女团指导员。

【人物背景】
- 原名：郑志民
- 出生：1915年黑龙江桦川
- 职务：东北抗联第五军妇女团指导员
- 事迹：八女投江英雄之一

【语言风格】
- 坚定勇敢，充满革命理想
- 对战友充满关爱
- 对敌人充满仇恨

【对话原则】
- 以第一人称讲述抗日斗争经历
- 展现女战士的英勇无畏
- 传递民族气节和革命精神`,

  zhaoyiman: `你现在扮演赵一曼同志，时间是1936年。你是东北抗日联军第三军二团政委。

【人物背景】
- 原名：李坤泰
- 出生：1905年四川宜宾
- 经历：黄埔军校→东北抗日
- 特点：文武双全，意志坚强

【语言风格】
- 知识分子气质
- 坚定的革命信念
- 对儿子充满母爱

【对话原则】
- 以第一人称讲述抗日经历
- 展现革命者的坚贞不屈
- 传递"未惜头颅新故国，甘将热血沃中华"的精神`,

  huangjigu: `你现在扮演黄继光同志，时间是1952年。你是中国人民志愿军第15军45师135团2营通信员。

【人物背景】
- 出生：1931年四川中江
- 职务：志愿军战士
- 事迹：上甘岭战役中用身体堵枪眼

【语言风格】
- 朴实的农村青年
- 对党和人民无限忠诚
- 不怕牺牲的英雄气概

【对话原则】
- 以第一人称讲述抗美援朝经历
- 展现普通战士的英雄壮举
- 传递"为了胜利，向我开炮"的牺牲精神`,

  qiujiahe: `你现在扮演邱少云同志，时间是1952年。你是中国人民志愿军第15军29师87团9连战士。

【人物背景】
- 出生：1926年四川铜梁
- 职务：志愿军战士
- 事迹：潜伏时被火烧身，纹丝不动直至牺牲

【语言风格】
- 沉稳坚毅
- 纪律严明
- 顾全大局

【对话原则】
- 以第一人称讲述潜伏任务
- 展现钢铁般的意志
- 传递严守纪律、顾全大局的精神`
};

// 工具函数定义（Function Call）
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_hero_biography',
      description: '获取革命英雄或时代楷模的详细生平事迹',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: '英雄人物的姓名，如"雷锋"、"焦裕禄"'
          }
        },
        required: ['name']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'query_historical_event',
      description: '查询特定历史事件的详细信息',
      parameters: {
        type: 'object',
        properties: {
          event_name: {
            type: 'string',
            description: '历史事件名称，如"南昌起义"、"遵义会议"'
          }
        },
        required: ['event_name']
      }
    }
  }
];

// 主函数
exports.main = async (event, context) => {
  const { question, history = [], mode = 'default', heroId, stream = false } = event;
  
  try {
    // 1. 构建System Prompt
    const systemPrompt = mode === 'hero' && heroId 
      ? PROMPTS[heroId] || PROMPTS.default
      : PROMPTS.default;
    
    // 2. 构建消息历史（限制10轮）
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: question }
    ];
    
    // 3. 流式输出模式（预留接口）
    if (stream) {
      // TODO: 实现流式输出
      // 需要使用 WebSocket 或 Server-Sent Events (SSE)
      // 小程序云函数暂不直接支持流式响应，需要通过以下方案：
      // 方案1: 使用云函数定时触发 + 云数据库实时推送
      // 方案2: 使用 HTTP API 云函数 + SSE
      // 方案3: 分段返回（伪流式）
      
      return {
        stream: true,
        message: '流式输出功能开发中，敬请期待',
        answer: await getStreamingResponse(messages, TOOLS, context.OPENID)
      };
    }
    
    // 4. 调用讯飞星火API（非流式）
    const response = await callSparkAPI(messages, TOOLS);
    
    // 5. 处理Function Call
    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];
      const functionResult = await executeFunctionCall(toolCall);
      
      // 6. 二次调用生成最终回答
      const finalMessages = [
        ...messages,
        { 
          role: 'assistant', 
          content: null, 
          tool_calls: response.tool_calls 
        },
        { 
          role: 'tool', 
          content: JSON.stringify(functionResult),
          tool_call_id: toolCall.id
        }
      ];
      
      const finalResponse = await callSparkAPI(finalMessages);
      
      // 7. 保存对话历史到数据库
      await saveChatHistory(context.OPENID, {
        question,
        answer: finalResponse.content,
        mode,
        heroId,
        timestamp: new Date()
      });
      
      return { answer: finalResponse.content };
    }
    
    // 没有Function Call，直接返回
    await saveChatHistory(context.OPENID, {
      question,
      answer: response.content,
      mode,
      heroId,
      timestamp: new Date()
    });
    
    return { answer: response.content };
    
  } catch (error) {
    console.error('AI对话错误:', error);
    return { 
      answer: '抱歉，我现在有点忙不过来。请稍后再试，或者换个问题问我吧。',
      error: error.message 
    };
  }
};

// 流式响应（预留接口）
async function getStreamingResponse(messages, tools, userId) {
  // TODO: 实现真正的流式输出
  // 当前返回完整响应，未来可以改造为：
  // 1. 调用支持 stream=true 的 API
  // 2. 将响应分段写入云数据库
  // 3. 小程序端监听数据库变化实时更新UI
  
  const response = await callSparkAPI(messages, tools);
  return response.content;
}

// 调用讯飞星火API
async function callSparkAPI(messages, tools = null) {
  // 生成鉴权URL
  const authUrl = generateAuthUrl();
  
  const requestBody = {
    model: 'spark-4.0-ultra',
    messages: messages,
    temperature: 0.7,
    max_tokens: 2048
  };
  
  // 如果提供了工具函数，添加到请求中
  if (tools) {
    requestBody.tools = tools;
    requestBody.tool_choice = 'auto';
  }
  
  try {
    const response = await axios.post(authUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    const choice = response.data.choices[0];
    
    // 检查是否有Function Call
    if (choice.message.tool_calls) {
      return {
        content: choice.message.content,
        tool_calls: choice.message.tool_calls
      };
    }
    
    return {
      content: choice.message.content
    };
    
  } catch (error) {
    console.error('调用星火API失败:', error.response?.data || error.message);
    throw new Error('AI服务暂时不可用');
  }
}

// 生成鉴权URL
function generateAuthUrl() {
  const { apiKey, apiSecret, apiUrl } = SPARK_CONFIG;
  
  // 解析URL
  const url = new URL(apiUrl);
  const host = url.host;
  const path = url.pathname;
  
  // 生成RFC1123格式的时间戳
  const date = new Date().toUTCString();
  
  // 构建签名字符串
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;
  
  // HMAC-SHA256签名
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(signatureOrigin)
    .digest('base64');
  
  // 构建authorization
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  const authorization = Buffer.from(authorizationOrigin).toString('base64');
  
  // 构建最终URL
  return `${apiUrl}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`;
}

// 执行Function Call
async function executeFunctionCall(toolCall) {
  const functionName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);
  
  if (functionName === 'get_hero_biography') {
    return await getHeroBiography(args.name);
  } else if (functionName === 'query_historical_event') {
    return await queryHistoricalEvent(args.event_name);
  }
  
  return { error: '未知的函数调用' };
}

// 获取英雄生平（从云存储的JSON文件读取）
async function getHeroBiography(name) {
  try {
    // 从云存储下载heroes.json
    const result = await cloud.downloadFile({
      fileID: 'cloud://your-env.xxxx/data/heroes.json'
    });
    
    const heroes = JSON.parse(result.fileContent.toString());
    const hero = heroes.find(h => h.name === name);
    
    if (hero) {
      return {
        name: hero.name,
        birth_year: hero.birth_year,
        death_year: hero.death_year,
        era: hero.era,
        title: hero.title,
        biography: hero.biography,
        main_deeds: hero.main_deeds,
        famous_quotes: hero.famous_quotes
      };
    }
    
    return { error: `未找到${name}的相关信息` };
    
  } catch (error) {
    console.error('获取英雄信息失败:', error);
    // 返回模拟数据
    return getMockHeroData(name);
  }
}

// 查询历史事件（从云存储的JSON文件读取）
async function queryHistoricalEvent(eventName) {
  try {
    const result = await cloud.downloadFile({
      fileID: 'cloud://your-env.xxxx/data/events.json'
    });
    
    const events = JSON.parse(result.fileContent.toString());
    const event = events.find(e => e.name === eventName);
    
    if (event) {
      return {
        name: event.name,
        date: event.date,
        location: event.location,
        participants: event.participants,
        significance: event.significance,
        background: event.background
      };
    }
    
    return { error: `未找到${eventName}的相关信息` };
    
  } catch (error) {
    console.error('获取事件信息失败:', error);
    return getMockEventData(eventName);
  }
}

// 模拟英雄数据（开发阶段使用）
function getMockHeroData(name) {
  const mockData = {
    '雷锋': {
      name: '雷锋',
      birth_year: 1940,
      death_year: 1962,
      era: '建设时期',
      title: '伟大的共产主义战士',
      biography: '雷锋，原名雷正兴，1940年出生于湖南省望城县。7岁成为孤儿，新中国成立后在党和政府的关怀下成长。1960年参军，在部队期间多次立功。1962年8月15日因公殉职，年仅22岁。',
      main_deeds: ['助人为乐', '勤俭节约', '钉子精神', '螺丝钉精神'],
      famous_quotes: ['人的生命是有限的，可是为人民服务是无限的，我要把有限的生命投入到无限的为人民服务之中去']
    },
    '焦裕禄': {
      name: '焦裕禄',
      birth_year: 1922,
      death_year: 1964,
      era: '建设时期',
      title: '县委书记的榜样',
      biography: '焦裕禄，1922年出生于山东淄博。1962年被调到河南兰考担任县委书记，带领全县人民治理"三害"（内涝、风沙、盐碱）。1964年5月14日因肝癌病逝，年仅42岁。',
      main_deeds: ['亲民爱民', '艰苦奋斗', '科学求实', '迎难而上', '无私奉献'],
      famous_quotes: ['革命者要在困难面前逞英雄']
    }
  };
  
  return mockData[name] || { error: `未找到${name}的相关信息` };
}

// 模拟事件数据
function getMockEventData(eventName) {
  const mockData = {
    '南昌起义': {
      name: '南昌起义',
      date: '1927-08-01',
      location: '江西南昌',
      participants: ['周恩来', '贺龙', '叶挺', '朱德', '刘伯承'],
      significance: '打响了武装反抗国民党反动派的第一枪，标志着中国共产党独立领导武装斗争和创建革命军队的开始',
      background: '1927年大革命失败后，国民党反动派背叛革命，对共产党人和革命群众进行疯狂屠杀。中国共产党为了挽救革命，决定举行武装起义。'
    },
    '遵义会议': {
      name: '遵义会议',
      date: '1935-01-15',
      location: '贵州遵义',
      participants: ['毛泽东', '周恩来', '朱德', '张闻天', '王稼祥'],
      significance: '确立了毛泽东同志在党中央和红军的领导地位，在极其危急的历史关头挽救了党、挽救了红军、挽救了中国革命',
      background: '第五次反"围剿"失败和长征初期的严重损失，使党和红军面临生死存亡的危机。'
    }
  };
  
  return mockData[eventName] || { error: `未找到${eventName}的相关信息` };
}

// 保存对话历史到数据库
async function saveChatHistory(openid, data) {
  try {
    await db.collection('chat_history').add({
      data: {
        user_id: openid,
        ...data,
        _createTime: db.serverDate()
      }
    });
  } catch (error) {
    console.error('保存对话历史失败:', error);
  }
}
