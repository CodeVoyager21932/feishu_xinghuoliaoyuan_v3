# 设计文档 - "星火"红色教育智能体小程序

## 1. 概述

本文档描述"星火"红色教育小程序的技术架构、核心组件设计和实现方案。项目采用Vibe Coding（AI辅助开发）方式，在7天内完成MVP版本，重点实现3个技术亮点：Function Call零幻觉AI、时间轴知识图谱、Tinder式卡片学习。

### 1.1 设计目标

- **快速交付**：7天内完成可演示的MVP版本
- **技术亮点**：展示AI、图可视化、游戏化学习的创新应用
- **成本可控**：使用免费/低成本的云服务和开源库
- **可扩展性**：预留硬件联动和功能扩展接口

### 1.2 技术选型原则

- 优先使用成熟的开源库和云服务
- 避免重复造轮子，聚焦业务逻辑
- 选择文档完善、社区活跃的技术栈
- 考虑团队技术背景和学习成本

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        微信小程序前端                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ AI对话   │  │ 知识图谱 │  │ 卡片学习 │  │ 英雄长廊 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                          │                                    │
│                     HTTPS/WSS                                 │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                    BFF中间层（云函数）                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  API路由  │  鉴权  │  限流  │  敏感词过滤  │  日志  │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────┼──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼──────┐  ┌───────▼────────┐
│ 讯飞星火API     │  │ 云数据库     │  │ 云存储         │
│ (Spark 4.0)    │  │ (MongoDB)   │  │ (图片/JSON)    │
└────────────────┘  └─────────────┘  └────────────────┘
```

### 2.2 技术栈

**前端（微信小程序）**
- 框架：微信小程序原生开发
- UI组件：WeUI + 自定义组件
- 图可视化：AntV G6（微信小程序版）
- 状态管理：全局状态 + 本地存储

**后端（BFF中间层）**
- 运行环境：微信云开发 - 云函数（Node.js 16）
- API框架：云函数HTTP触发器
- 数据库：云开发数据库（MongoDB）
- 存储：云存储（图片、JSON文件）

**第三方服务**
- AI能力：讯飞星火4.0 Ultra API
- 认证：微信登录


## 3. 核心模块设计

### 3.1 AI虚拟讲解员模块

#### 3.1.1 架构设计

```
小程序前端                BFF中间层                讯飞星火API
    │                        │                        │
    │  1. 发送问题            │                        │
    ├───────────────────────>│                        │
    │                        │  2. 鉴权+限流          │
    │                        │  3. 构建Prompt         │
    │                        │  4. 调用API            │
    │                        ├───────────────────────>│
    │                        │                        │  5. 意图识别
    │                        │                        │  6. Function Call?
    │                        │<───────────────────────┤
    │                        │  7. 执行函数查询JSON    │
    │                        │  8. 回传数据            │
    │                        ├───────────────────────>│
    │                        │                        │  9. 生成回答
    │  10. 返回回答           │<───────────────────────┤
    │<───────────────────────┤                        │
```

#### 3.1.2 System Prompt设计

**基础Prompt模板**：
```
你是"星火同志"，一位深耕中共党史五十年的资深研究员，同时也是一位擅长与青少年沟通的金牌导游。

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
- 最后提出1个相关的引导问题

【当前对话模式】：普通讲解模式
```

**英雄对话模式Prompt**（以雷锋为例）：
```
你现在扮演雷锋同志，时间是1962年。你是一名解放军战士，热爱党、热爱人民。

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
- 传递"为人民服务"的精神
```


#### 3.1.3 Function Call实现

**工具函数定义**：
```javascript
const tools = [
  {
    type: "function",
    function: {
      name: "get_hero_biography",
      description: "获取革命英雄或时代楷模的详细生平事迹",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "英雄人物的姓名，如'雷锋'、'焦裕禄'"
          }
        },
        required: ["name"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "query_historical_event",
      description: "查询特定历史事件的详细信息",
      parameters: {
        type: "object",
        properties: {
          event_name: {
            type: "string",
            description: "历史事件名称，如'南昌起义'、'遵义会议'"
          }
        },
        required: ["event_name"]
      }
    }
  }
];
```

**知识库JSON结构**：
```json
{
  "heroes": [
    {
      "id": "hero_001",
      "name": "雷锋",
      "birth_year": 1940,
      "death_year": 1962,
      "era": "建设时期",
      "title": "伟大的共产主义战士",
      "biography": "雷锋，原名雷正兴，1940年出生于湖南省望城县...",
      "main_deeds": ["助人为乐", "勤俭节约", "钉子精神"],
      "famous_quotes": ["人的生命是有限的，可是为人民服务是无限的..."]
    }
  ],
  "events": [
    {
      "id": "event_001",
      "name": "南昌起义",
      "date": "1927-08-01",
      "location": "江西南昌",
      "participants": ["周恩来", "贺龙", "叶挺", "朱德"],
      "significance": "打响了武装反抗国民党反动派的第一枪，标志着中国共产党独立领导武装斗争的开始"
    }
  ]
}
```

#### 3.1.4 对话流程实现

**云函数代码结构**：
```javascript
// cloud/functions/ai-chat/index.js
const crypto = require('crypto');
const axios = require('axios');

exports.main = async (event, context) => {
  const { question, history, mode } = event;
  
  // 1. 构建System Prompt
  const systemPrompt = mode === 'hero' 
    ? getHeroPrompt(event.heroName)
    : getDefaultPrompt();
  
  // 2. 构建消息历史（限制10轮）
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10),
    { role: 'user', content: question }
  ];
  
  // 3. 调用讯飞星火API
  const response = await callSparkAPI(messages, tools);
  
  // 4. 处理Function Call
  if (response.tool_calls) {
    const functionResult = await executeFunctionCall(response.tool_calls[0]);
    // 5. 二次调用生成最终回答
    const finalResponse = await callSparkAPI([
      ...messages,
      { role: 'assistant', content: null, tool_calls: response.tool_calls },
      { role: 'tool', content: JSON.stringify(functionResult) }
    ]);
    return { answer: finalResponse.content };
  }
  
  return { answer: response.content };
};
```


### 3.2 知识图谱可视化模块

#### 3.2.1 数据模型设计

**图数据结构**：
```json
{
  "nodes": [
    {
      "id": "event_001",
      "type": "event",
      "label": "中共一大",
      "year": 1921,
      "date": "1921-07-23",
      "description": "中国共产党第一次全国代表大会",
      "image": "cloud://xxx.png"
    },
    {
      "id": "person_001",
      "type": "person",
      "label": "毛泽东",
      "birth_year": 1893,
      "role": "革命领袖"
    }
  ],
  "edges": [
    {
      "source": "person_001",
      "target": "event_001",
      "type": "PARTICIPATED_IN",
      "label": "参加"
    },
    {
      "source": "event_001",
      "target": "event_002",
      "type": "NEXT_EVENT",
      "label": "促进"
    }
  ]
}
```

#### 3.2.2 AntV G6配置

**时间轴布局算法**：
```javascript
// pages/knowledge-graph/graph-config.js
const graphConfig = {
  width: 750,
  height: 1200,
  modes: {
    default: ['drag-canvas', 'zoom-canvas', 'drag-node']
  },
  layout: {
    type: 'force',
    preventOverlap: true,
    nodeSpacing: 50,
    // 自定义力：X轴按时间排列
    onTick: () => {
      graph.getNodes().forEach(node => {
        const model = node.getModel();
        if (model.year) {
          // 将1921-2024年映射到X轴0-700
          const targetX = ((model.year - 1921) / (2024 - 1921)) * 700;
          // 施加X轴定位力
          model.fx = targetX;
        }
      });
    }
  },
  defaultNode: {
    type: 'circle',
    size: 40,
    style: {
      fill: '#C6E5FF',
      stroke: '#5B8FF9',
      lineWidth: 2
    },
    labelCfg: {
      position: 'bottom',
      style: {
        fontSize: 12,
        fill: '#000'
      }
    }
  },
  defaultEdge: {
    type: 'line',
    style: {
      stroke: '#e2e2e2',
      lineWidth: 1
    }
  }
};
```

#### 3.2.3 交互设计

**焦点上下文交互**：
```javascript
// 点击节点高亮关联节点
graph.on('node:click', (e) => {
  const clickedNode = e.item;
  const nodeId = clickedNode.getID();
  
  // 1. 获取关联节点
  const relatedNodes = graph.getNeighbors(clickedNode);
  const relatedIds = relatedNodes.map(n => n.getID());
  
  // 2. 降低非关联节点透明度
  graph.getNodes().forEach(node => {
    const id = node.getID();
    if (id !== nodeId && !relatedIds.includes(id)) {
      graph.updateItem(node, {
        style: { opacity: 0.2 }
      });
    }
  });
  
  // 3. 高亮关联边
  graph.getEdges().forEach(edge => {
    const source = edge.getSource().getID();
    const target = edge.getTarget().getID();
    if (source === nodeId || target === nodeId) {
      graph.updateItem(edge, {
        style: { stroke: '#5B8FF9', lineWidth: 2 }
      });
    } else {
      graph.updateItem(edge, {
        style: { opacity: 0.2 }
      });
    }
  });
  
  // 4. 显示详情卡片
  showDetailCard(clickedNode.getModel());
});
```


### 3.3 Tinder式卡片学习模块

#### 3.3.1 数据模型设计

**卡片数据结构**：
```json
{
  "cards": [
    {
      "id": "card_001",
      "front_image": "cloud://red-boat.jpg",
      "front_title": "南湖红船",
      "back_content": "1921年7月，中共一大在上海召开，后因法租界巡捕搜查，转移到嘉兴南湖的一艘游船上继续进行，这艘船被称为'红船'。",
      "back_keywords": ["中共一大", "1921年", "嘉兴南湖"],
      "difficulty": "easy",
      "category": "革命时期"
    }
  ]
}
```

**用户学习记录**：
```json
{
  "user_id": "xxx",
  "mastered_cards": ["card_001", "card_005"],
  "review_queue": [
    {
      "card_id": "card_002",
      "next_review_time": "2024-01-15T10:30:00Z",
      "review_count": 1
    }
  ],
  "learning_stats": {
    "total_cards": 50,
    "mastered_count": 15,
    "review_count": 8
  }
}
```

#### 3.3.2 艾宾浩斯遗忘曲线算法

**简化版复习间隔**：
```javascript
// utils/ebbinghaus.js
const REVIEW_INTERVALS = [
  5 * 60 * 1000,      // 5分钟
  60 * 60 * 1000,     // 1小时
  24 * 60 * 60 * 1000 // 1天
];

function calculateNextReviewTime(reviewCount) {
  if (reviewCount >= REVIEW_INTERVALS.length) {
    // 超过3次复习，标记为已掌握
    return null;
  }
  const interval = REVIEW_INTERVALS[reviewCount];
  return new Date(Date.now() + interval);
}

function getCardsToReview(reviewQueue) {
  const now = new Date();
  return reviewQueue.filter(item => {
    return new Date(item.next_review_time) <= now;
  });
}
```

#### 3.3.3 卡片滑动交互

**WXML结构**：
```xml
<view class="card-container">
  <movable-area class="movable-area">
    <movable-view 
      class="card"
      direction="all"
      bindchange="onCardMove"
      bindtouchend="onCardRelease"
    >
      <view class="card-front" wx:if="{{!flipped}}">
        <image src="{{currentCard.front_image}}" />
        <text>{{currentCard.front_title}}</text>
      </view>
      <view class="card-back" wx:else>
        <text>{{currentCard.back_content}}</text>
      </view>
    </movable-view>
  </movable-area>
</view>
```

**滑动逻辑**：
```javascript
// pages/card-learning/index.js
Page({
  data: {
    currentCard: {},
    flipped: false
  },
  
  onCardRelease(e) {
    const { x } = e.detail;
    const threshold = 100; // 滑动阈值
    
    if (x < -threshold) {
      // 左滑：不认识
      this.markAsReview();
      this.animateCardOut('left');
    } else if (x > threshold) {
      // 右滑：已掌握
      this.markAsMastered();
      this.animateCardOut('right');
    } else {
      // 回弹
      this.animateCardBack();
    }
  },
  
  markAsReview() {
    const cardId = this.data.currentCard.id;
    const nextReviewTime = calculateNextReviewTime(0);
    // 调用云函数保存复习记录
    wx.cloud.callFunction({
      name: 'update-learning-record',
      data: { cardId, action: 'review', nextReviewTime }
    });
  },
  
  markAsMastered() {
    const cardId = this.data.currentCard.id;
    // 调用云函数标记为已掌握
    wx.cloud.callFunction({
      name: 'update-learning-record',
      data: { cardId, action: 'master' }
    });
    // 显示星火动画
    this.showSparkAnimation();
  }
});
```


## 4. 数据库设计

### 4.1 集合（Collection）设计

**users集合**：
```javascript
{
  _id: "user_xxx",
  openid: "oXXXX",
  nickname: "张三",
  avatar_url: "https://xxx.jpg",
  created_at: ISODate("2024-01-01T00:00:00Z"),
  learning_stats: {
    total_days: 15,
    continuous_days: 7,
    ai_chat_count: 50,
    mastered_cards: 30,
    quiz_accuracy: 0.85
  },
  achievements: ["first_login", "7_days_streak", "50_cards_master"]
}
```

**chat_history集合**：
```javascript
{
  _id: "chat_xxx",
  user_id: "user_xxx",
  mode: "default", // default | hero
  hero_name: null, // 或 "雷锋"
  messages: [
    {
      role: "user",
      content: "南昌起义是什么时候？",
      timestamp: ISODate("2024-01-15T10:00:00Z")
    },
    {
      role: "assistant",
      content: "南昌起义发生在1927年8月1日...",
      timestamp: ISODate("2024-01-15T10:00:05Z")
    }
  ],
  created_at: ISODate("2024-01-15T10:00:00Z")
}
```

**learning_records集合**：
```javascript
{
  _id: "record_xxx",
  user_id: "user_xxx",
  card_id: "card_001",
  status: "reviewing", // reviewing | mastered
  review_count: 2,
  next_review_time: ISODate("2024-01-16T10:00:00Z"),
  last_review_time: ISODate("2024-01-15T10:00:00Z"),
  created_at: ISODate("2024-01-14T10:00:00Z")
}
```

**check_in集合**：
```javascript
{
  _id: "checkin_xxx",
  user_id: "user_xxx",
  date: "2024-01-15",
  timestamp: ISODate("2024-01-15T08:00:00Z")
}
```

### 4.2 云存储结构

```
cloud-storage/
├── heroes/
│   ├── hero_001.jpg (雷锋头像)
│   ├── hero_002.jpg
│   └── ...
├── events/
│   ├── event_001.jpg (南昌起义图片)
│   └── ...
├── cards/
│   ├── card_001_front.jpg (红船照片)
│   └── ...
└── data/
    ├── heroes.json (英雄数据)
    ├── events.json (事件数据)
    ├── graph.json (图谱数据)
    └── cards.json (卡片数据)
```

## 5. API设计

### 5.1 云函数列表

| 函数名 | 功能 | 输入 | 输出 |
|--------|------|------|------|
| `ai-chat` | AI对话 | question, history, mode | answer |
| `get-graph-data` | 获取图谱数据 | filter | nodes, edges |
| `get-hero-list` | 获取英雄列表 | era | heroes[] |
| `get-hero-detail` | 获取英雄详情 | hero_id | hero_info |
| `get-card-list` | 获取卡片列表 | user_id | cards[], review_queue |
| `update-learning-record` | 更新学习记录 | card_id, action | success |
| `check-in` | 学习打卡 | user_id | continuous_days |
| `get-user-stats` | 获取用户统计 | user_id | stats, achievements |

### 5.2 API调用示例

**AI对话**：
```javascript
wx.cloud.callFunction({
  name: 'ai-chat',
  data: {
    question: '南昌起义的意义是什么？',
    history: [
      { role: 'user', content: '你好' },
      { role: 'assistant', content: '你好！我是星火同志...' }
    ],
    mode: 'default'
  },
  success: res => {
    console.log(res.result.answer);
  }
});
```

**获取图谱数据**：
```javascript
wx.cloud.callFunction({
  name: 'get-graph-data',
  data: {
    filter: 'revolution' // revolution | construction | reform
  },
  success: res => {
    const { nodes, edges } = res.result;
    this.renderGraph(nodes, edges);
  }
});
```


## 6. 页面结构设计

### 6.1 页面导航结构

```
首页 (index)
├── AI对话 (ai-chat)
│   └── 选择英雄对话 (hero-select)
├── 知识图谱 (knowledge-graph)
│   └── 事件详情 (event-detail)
├── 卡片学习 (card-learning)
├── 英雄长廊 (hero-gallery)
│   └── 英雄详情 (hero-detail)
└── 个人中心 (profile)
    ├── 学习统计 (stats)
    └── 成就徽章 (achievements)
```

### 6.2 首页设计

**布局结构**：
```xml
<view class="home-page">
  <!-- 顶部用户信息 -->
  <view class="header">
    <image class="avatar" src="{{userInfo.avatar}}" />
    <text class="nickname">{{userInfo.nickname}}</text>
    <view class="check-in-btn" bindtap="onCheckIn">
      <text>打卡</text>
    </view>
  </view>
  
  <!-- 今日英雄卡片 -->
  <view class="today-hero-card">
    <image src="{{todayHero.avatar}}" />
    <view class="hero-info">
      <text class="name">{{todayHero.name}}</text>
      <text class="desc">{{todayHero.brief}}</text>
    </view>
  </view>
  
  <!-- 功能入口 -->
  <view class="function-grid">
    <view class="grid-item" bindtap="goToAIChat">
      <image src="/images/icon-ai.png" />
      <text>AI讲解员</text>
    </view>
    <view class="grid-item" bindtap="goToGraph">
      <image src="/images/icon-graph.png" />
      <text>知识图谱</text>
    </view>
    <view class="grid-item" bindtap="goToCards">
      <image src="/images/icon-card.png" />
      <text>卡片学习</text>
    </view>
    <view class="grid-item" bindtap="goToHeroes">
      <image src="/images/icon-hero.png" />
      <text>英雄长廊</text>
    </view>
  </view>
  
  <!-- 学习统计 -->
  <view class="stats-card">
    <view class="stat-item">
      <text class="value">{{stats.continuous_days}}</text>
      <text class="label">连续打卡</text>
    </view>
    <view class="stat-item">
      <text class="value">{{stats.mastered_cards}}</text>
      <text class="label">掌握卡片</text>
    </view>
    <view class="stat-item">
      <text class="value">{{stats.ai_chat_count}}</text>
      <text class="label">AI问答</text>
    </view>
  </view>
</view>
```

### 6.3 AI对话页面设计

**核心组件**：
```xml
<view class="chat-page">
  <!-- 顶部导航 -->
  <view class="chat-header">
    <image class="ai-avatar" src="/images/xinghuo-avatar.png" />
    <text class="ai-name">星火同志</text>
    <button class="switch-mode-btn" bindtap="showHeroSelect">
      切换对话模式
    </button>
  </view>
  
  <!-- 消息列表 -->
  <scroll-view class="message-list" scroll-y scroll-into-view="{{scrollToId}}">
    <block wx:for="{{messages}}" wx:key="index">
      <view class="message-item {{item.role}}">
        <image class="avatar" src="{{item.role === 'user' ? userAvatar : aiAvatar}}" />
        <view class="bubble">
          <text>{{item.content}}</text>
        </view>
      </view>
    </block>
    <!-- 加载中提示 -->
    <view class="loading" wx:if="{{isLoading}}">
      <text>思考中...</text>
    </view>
  </scroll-view>
  
  <!-- 输入框 -->
  <view class="input-bar">
    <input 
      class="input" 
      placeholder="向星火同志提问..." 
      value="{{inputText}}"
      bindinput="onInput"
    />
    <button class="send-btn" bindtap="onSend">发送</button>
  </view>
</view>
```

### 6.4 知识图谱页面设计

**核心组件**：
```xml
<view class="graph-page">
  <!-- 顶部筛选 -->
  <view class="filter-bar">
    <button 
      class="filter-btn {{filter === 'all' ? 'active' : ''}}"
      bindtap="onFilterChange"
      data-filter="all"
    >全部</button>
    <button 
      class="filter-btn {{filter === 'revolution' ? 'active' : ''}}"
      bindtap="onFilterChange"
      data-filter="revolution"
    >革命时期</button>
    <button 
      class="filter-btn {{filter === 'construction' ? 'active' : ''}}"
      bindtap="onFilterChange"
      data-filter="construction"
    >建设时期</button>
  </view>
  
  <!-- 图谱画布 -->
  <canvas 
    type="2d" 
    id="graph-canvas"
    class="graph-canvas"
  ></canvas>
  
  <!-- 详情卡片（底部弹出） -->
  <view class="detail-card {{showDetail ? 'show' : ''}}" catchtap="hideDetail">
    <view class="card-content" catchtap="stopPropagation">
      <text class="title">{{selectedNode.label}}</text>
      <text class="date">{{selectedNode.date}}</text>
      <text class="desc">{{selectedNode.description}}</text>
      <button class="ai-btn" bindtap="askAI">AI详解</button>
    </view>
  </view>
</view>
```


## 7. 样式设计规范

### 7.1 色彩系统

**主色调**：
```css
/* 红色系（主题色） */
--primary-red: #D32F2F;
--primary-red-light: #EF5350;
--primary-red-dark: #C62828;

/* 金色系（辅助色） */
--gold: #FFD700;
--gold-light: #FFE57F;

/* 中性色 */
--text-primary: #212121;
--text-secondary: #757575;
--text-hint: #BDBDBD;
--divider: #E0E0E0;
--background: #FAFAFA;
--card-bg: #FFFFFF;
```

### 7.2 字体规范

```css
/* 标题 */
.title-large { font-size: 36rpx; font-weight: 600; }
.title-medium { font-size: 32rpx; font-weight: 600; }
.title-small { font-size: 28rpx; font-weight: 500; }

/* 正文 */
.body-large { font-size: 32rpx; font-weight: 400; }
.body-medium { font-size: 28rpx; font-weight: 400; }
.body-small { font-size: 24rpx; font-weight: 400; }

/* 辅助文字 */
.caption { font-size: 22rpx; color: var(--text-secondary); }
```

### 7.3 组件样式

**卡片样式**：
```css
.card {
  background: var(--card-bg);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  padding: 32rpx;
  margin: 24rpx;
}
```

**按钮样式**：
```css
.btn-primary {
  background: var(--primary-red);
  color: #FFFFFF;
  border-radius: 48rpx;
  padding: 24rpx 48rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.btn-secondary {
  background: transparent;
  color: var(--primary-red);
  border: 2rpx solid var(--primary-red);
  border-radius: 48rpx;
  padding: 24rpx 48rpx;
}
```

## 8. 性能优化策略

### 8.1 图片优化

1. **压缩**：所有图片使用TinyPNG压缩，控制在100KB以内
2. **懒加载**：列表页面使用`lazy-load`属性
3. **CDN**：使用云存储CDN加速图片加载
4. **格式**：优先使用WebP格式（降级为JPG）

### 8.2 数据缓存

```javascript
// utils/cache.js
const CACHE_KEYS = {
  HEROES: 'heroes_data',
  GRAPH: 'graph_data',
  CARDS: 'cards_data'
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

function setCache(key, data) {
  wx.setStorageSync(key, {
    data,
    timestamp: Date.now()
  });
}

function getCache(key) {
  const cache = wx.getStorageSync(key);
  if (!cache) return null;
  
  const isExpired = Date.now() - cache.timestamp > CACHE_DURATION;
  if (isExpired) {
    wx.removeStorageSync(key);
    return null;
  }
  
  return cache.data;
}
```

### 8.3 知识图谱性能优化

1. **节点数量控制**：初始加载50个节点，按需加载更多
2. **Canvas离屏渲染**：使用离屏Canvas提升渲染性能
3. **防抖节流**：拖拽和缩放操作使用节流函数
4. **简化布局**：降低力导向算法的迭代次数

```javascript
// 节流函数
function throttle(fn, delay) {
  let timer = null;
  return function(...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

// 应用到拖拽事件
const onDragThrottled = throttle(onDrag, 16); // 60fps
```

## 9. 错误处理与日志

### 9.1 错误处理策略

```javascript
// utils/error-handler.js
function handleError(error, context) {
  console.error(`[${context}] Error:`, error);
  
  // 用户友好的错误提示
  const userMessage = getUserFriendlyMessage(error);
  wx.showToast({
    title: userMessage,
    icon: 'none',
    duration: 2000
  });
  
  // 上报错误日志
  reportError(error, context);
}

function getUserFriendlyMessage(error) {
  if (error.code === 'NETWORK_ERROR') {
    return '网络连接失败，请检查网络';
  } else if (error.code === 'API_LIMIT') {
    return 'AI服务繁忙，请稍后再试';
  } else {
    return '操作失败，请重试';
  }
}
```

### 9.2 日志记录

```javascript
// cloud/functions/logger/index.js
exports.main = async (event, context) => {
  const { level, message, data, timestamp } = event;
  
  const db = cloud.database();
  await db.collection('logs').add({
    data: {
      level,
      message,
      data,
      timestamp: new Date(timestamp),
      user_id: context.OPENID
    }
  });
  
  return { success: true };
};
```

## 10. 测试策略

### 10.1 单元测试

使用miniprogram-simulate进行组件测试：
```javascript
// test/components/card.test.js
const simulate = require('miniprogram-simulate');

test('卡片左滑标记为复习', () => {
  const comp = simulate.load('/components/card/index');
  const instance = comp.instance;
  
  instance.onSwipeLeft();
  
  expect(instance.data.status).toBe('review');
});
```

### 10.2 集成测试

测试云函数调用：
```javascript
// test/cloud-functions/ai-chat.test.js
const cloud = require('wx-server-sdk');

test('AI对话返回正确格式', async () => {
  const result = await cloud.callFunction({
    name: 'ai-chat',
    data: {
      question: '测试问题',
      history: [],
      mode: 'default'
    }
  });
  
  expect(result.result).toHaveProperty('answer');
  expect(typeof result.result.answer).toBe('string');
});
```

### 10.3 用户测试

1. **内部测试**：团队成员完整走通所有流程
2. **小范围测试**：邀请5-10名目标用户试用
3. **收集反馈**：记录用户操作路径和问题点
4. **快速迭代**：根据反馈优化交互和文案

## 11. 部署方案

### 11.1 开发环境

- 使用微信开发者工具本地调试
- 云函数使用本地调试模式
- 数据库使用测试环境

### 11.2 生产环境

1. **云函数部署**：
```bash
# 部署所有云函数
npm run deploy:cloud

# 部署单个云函数
cd cloud/functions/ai-chat
npm install
wx-server-sdk upload
```

2. **小程序发布**：
```bash
# 上传代码
npm run upload

# 提交审核
在微信公众平台提交审核
```

3. **数据初始化**：
```javascript
// scripts/init-data.js
// 上传英雄数据、事件数据、图谱数据到云数据库
```

## 12. 后续扩展规划

### 12.1 二期功能

1. **VR虚拟展馆**：使用Three.js实现360度全景
2. **语音交互**：接入语音识别和语音合成
3. **社交功能**：学习排行榜、好友PK
4. **硬件联动**：与"启航小智"机器人数据同步

### 12.2 技术优化

1. **流式响应**：实现AI对话的打字机效果
2. **离线模式**：缓存核心数据支持离线学习
3. **个性化推荐**：基于用户行为的智能推荐算法
4. **多语言支持**：支持少数民族语言

---

## 附录：关键技术文档链接

- [讯飞星火API文档](https://www.xfyun.cn/doc/spark/Web.html)
- [AntV G6文档](https://g6.antv.antgroup.com/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
