# 星火小程序 - 项目结构分析与核心文件白名单

## 📋 一、页面注册清单

### 1.1 主包页面 (app.json - pages)

| 序号 | 页面路径 | 页面名称 | 是否核心 | 说明 |
|------|---------|---------|---------|------|
| 1 | `pages/index/index` | 首页 | ✅ **核心** | 小程序启动页，所有功能入口 |
| 2 | `pages/ai-chat/index` | AI讲解员 | ✅ **核心** | 多页面跳转目标，核心功能 |
| 3 | `pages/knowledge-graph/index` | 党史知识图谱 | ⚠️ 重要 | 从首页可访问 |
| 4 | `pages/card-learning/index` | 卡片学习 | ⚠️ 重要 | 从首页可访问 |
| 5 | `pages/hero-gallery/hero-gallery` | 英雄长廊 | ⚠️ 重要 | 从首页可访问 |
| 6 | `pages/hero-detail/hero-detail` | 英雄详情 | ⚠️ 重要 | 从首页和英雄长廊跳转 |
| 7 | `pages/profile/profile` | 个人中心 | ⚠️ 重要 | TabBar页面（如果有） |
| 8 | `pages/mystery-box/mystery-box` | 机密档案/盲盒 | 🔵 可选 | 从首页可访问 |
| 9 | `pages/museum/museum` | 红色珍藏馆 | 🔵 可选 | 从首页和盲盒页跳转 |
| 10 | `pages/pk-battle/pk-battle` | 党史PK对战 | 🔵 可选 | 从首页可访问 |
| 11 | `pages/radio/radio` | 红色电台 | 🔵 可选 | 从首页可访问 |

### 1.2 分包配置
**当前状态**: ❌ 无分包配置

---

## 🧩 二、组件使用清单

### 2.1 全局组件 (app.json - usingComponents)
**当前状态**: ❌ 无全局组件配置

### 2.2 页面级组件

| 页面 | 使用的组件 | 组件路径 |
|------|-----------|---------|
| `pages/index/index` | navigation-bar | `/components/navigation-bar/navigation-bar` |
| | daily-sign-modal | `/components/daily-sign-modal/daily-sign-modal` |
| | audio-player | `/components/audio-player/audio-player` |

### 2.3 组件清单

| 组件名称 | 路径 | 使用页面 | 是否核心 |
|---------|------|---------|---------|
| navigation-bar | `/components/navigation-bar/` | index | ✅ **核心** |
| daily-sign-modal | `/components/daily-sign-modal/` | index | ✅ **核心** |
| audio-player | `/components/audio-player/` | index | ⚠️ 重要 |

---

## 📦 三、数据文件依赖

### 3.1 数据文件清单

| 数据文件 | 使用页面/组件 | 是否核心 |
|---------|-------------|---------|
| `data/cards.js` | card-learning | ⚠️ 重要 |
| `data/heroes.js` | index, hero-gallery, hero-detail | ✅ **核心** |
| `data/daily-quotes.js` | index | ✅ **核心** |
| `data/graph.js` | knowledge-graph | ⚠️ 重要 |
| `data/relics.js` | mystery-box, museum | 🔵 可选 |
| `data/quiz-questions.js` | pk-battle | 🔵 可选 |
| `data/radio-playlist.js` | radio | 🔵 可选 |

### 3.2 工具文件清单

| 工具文件 | 使用位置 | 是否核心 |
|---------|---------|---------|
| `utils/error-handler.js` | ai-chat | ✅ **核心** |
| `utils/audio-manager.js` | radio, audio-player | 🔵 可选 |
| `utils/cache.js` | 未使用 | ❌ 可删除 |
| `utils/image.js` | 未使用 | ❌ 可删除 |
| `utils/performance.js` | 未使用 | ❌ 可删除 |
| `utils/request.js` | 未使用 | ❌ 可删除 |
| `utils/validator.js` | 未使用 | ❌ 可删除 |

---

## 🎯 四、核心文件白名单

### 4.1 绝对核心文件（小程序启动必需）

#### 应用级文件
```
miniprogram/
├── app.js                          ✅ 应用入口
├── app.json                        ✅ 应用配置
├── app.wxss                        ✅ 全局样式
├── sitemap.json                    ✅ 索引配置
├── project.config.json             ✅ 项目配置
└── project.private.config.json     ✅ 私有配置
```

#### 首页相关（启动页）
```
miniprogram/pages/index/
├── index.js                        ✅ 首页逻辑
├── index.json                      ✅ 首页配置
├── index.wxml                      ✅ 首页结构
└── index.wxss                      ✅ 首页样式
```

#### 首页依赖的组件
```
miniprogram/components/
├── navigation-bar/                 ✅ 自定义导航栏
│   ├── navigation-bar.js
│   ├── navigation-bar.json
│   ├── navigation-bar.wxml
│   └── navigation-bar.wxss
├── daily-sign-modal/               ✅ 每日签到弹窗
│   ├── daily-sign-modal.js
│   ├── daily-sign-modal.json
│   ├── daily-sign-modal.wxml
│   └── daily-sign-modal.wxss
└── audio-player/                   ⚠️ 音频播放器（可选）
    ├── audio-player.js
    ├── audio-player.json
    ├── audio-player.wxml
    └── audio-player.wxss
```

#### 首页依赖的数据
```
miniprogram/data/
├── heroes.js                       ✅ 英雄数据
└── daily-quotes.js                 ✅ 每日名言
```

### 4.2 重要功能文件（核心体验）

#### AI对话页面
```
miniprogram/pages/ai-chat/
├── index.js                        ✅ AI对话逻辑
├── index.json                      ✅ 页面配置
├── index.wxml                      ✅ 页面结构
└── index.wxss                      ✅ 页面样式
```

#### AI对话依赖
```
miniprogram/utils/
└── error-handler.js                ✅ 错误处理工具
```

### 4.3 次要功能文件（可按需保留）

#### 卡片学习
```
miniprogram/pages/card-learning/
├── index.js
├── index.json
├── index.wxml
└── index.wxss

miniprogram/data/
└── cards.js
```

#### 知识图谱
```
miniprogram/pages/knowledge-graph/
├── index.js
├── index.json
├── index.wxml
└── index.wxss

miniprogram/data/
└── graph.js
```

#### 英雄相关
```
miniprogram/pages/hero-gallery/
├── hero-gallery.js
├── hero-gallery.json
├── hero-gallery.wxml
└── hero-gallery.wxss

miniprogram/pages/hero-detail/
├── hero-detail.js
├── hero-detail.json
├── hero-detail.wxml
└── hero-detail.wxss
```

#### 个人中心
```
miniprogram/pages/profile/
├── profile.js
├── profile.json
├── profile.wxml
└── profile.wxss
```

### 4.4 可删除文件（非核心功能）

#### 游戏娱乐功能
```
miniprogram/pages/mystery-box/      🗑️ 盲盒抽奖
miniprogram/pages/museum/           🗑️ 珍藏馆
miniprogram/pages/pk-battle/        🗑️ PK对战
miniprogram/pages/radio/            🗑️ 红色电台

miniprogram/data/
├── relics.js                       🗑️ 文物数据
├── quiz-questions.js               🗑️ 题库数据
└── radio-playlist.js               🗑️ 电台数据

miniprogram/utils/
└── audio-manager.js                🗑️ 音频管理（如删除电台）
```

#### 未使用的工具文件
```
miniprogram/utils/
├── cache.js                        🗑️ 未使用
├── image.js                        🗑️ 未使用
├── performance.js                  🗑️ 未使用
├── request.js                      🗑️ 未使用
└── validator.js                    🗑️ 未使用
```

---

## 📊 五、瘦身建议

### 5.1 最小可运行版本（MVP）

**保留页面**:
- ✅ pages/index/index（首页）
- ✅ pages/ai-chat/index（AI对话）
- ✅ pages/profile/profile（个人中心）

**保留组件**:
- ✅ components/navigation-bar（自定义导航）
- ✅ components/daily-sign-modal（签到功能）

**保留数据**:
- ✅ data/heroes.js
- ✅ data/daily-quotes.js

**保留工具**:
- ✅ utils/error-handler.js

**预计减少**: ~60% 代码量

### 5.2 标准版本（推荐）

**在MVP基础上增加**:
- ⚠️ pages/card-learning（卡片学习）
- ⚠️ pages/knowledge-graph（知识图谱）
- ⚠️ pages/hero-gallery + hero-detail（英雄长廊）
- ⚠️ data/cards.js
- ⚠️ data/graph.js

**预计减少**: ~35% 代码量

### 5.3 完整版本（当前）

保留所有功能，不删除任何文件。

---

## 🔍 六、页面跳转关系图

```
pages/index/index (首页)
├─→ pages/ai-chat/index
├─→ pages/knowledge-graph/index
│   └─→ pages/ai-chat/index
├─→ pages/card-learning/index
│   └─→ pages/ai-chat/index
├─→ pages/hero-gallery/hero-gallery
│   └─→ pages/hero-detail/hero-detail
│       └─→ pages/ai-chat/index
├─→ pages/mystery-box/mystery-box
│   └─→ pages/museum/museum
│       └─→ pages/mystery-box/mystery-box
├─→ pages/museum/museum
├─→ pages/pk-battle/pk-battle
│   └─→ pages/index/index (switchTab)
└─→ pages/radio/radio
```

---

## ✅ 七、执行建议

### 阶段一：清理未使用的工具文件
```bash
# 可安全删除
miniprogram/utils/cache.js
miniprogram/utils/image.js
miniprogram/utils/performance.js
miniprogram/utils/request.js
miniprogram/utils/validator.js
```

### 阶段二：移除非核心功能（可选）
如果要瘦身，建议按以下优先级删除：

**优先级1（影响最小）**:
- pages/radio（红色电台）
- data/radio-playlist.js
- utils/audio-manager.js（如果不用音频）
- components/audio-player（如果不用音频）

**优先级2**:
- pages/pk-battle（PK对战）
- data/quiz-questions.js

**优先级3**:
- pages/mystery-box + pages/museum（盲盒+珍藏馆）
- data/relics.js

### 阶段三：分包优化（推荐）
将非核心页面移到分包，减少主包体积：

```json
{
  "pages": [
    "pages/index/index",
    "pages/ai-chat/index",
    "pages/profile/profile"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/card-learning/index",
        "pages/knowledge-graph/index",
        "pages/hero-gallery/hero-gallery",
        "pages/hero-detail/hero-detail"
      ]
    },
    {
      "root": "packageB",
      "pages": [
        "pages/mystery-box/mystery-box",
        "pages/museum/museum",
        "pages/pk-battle/pk-battle",
        "pages/radio/radio"
      ]
    }
  ]
}
```

---

## 📝 八、总结

### 当前项目规模
- **总页面数**: 11个
- **组件数**: 3个
- **数据文件**: 7个
- **工具文件**: 7个（5个未使用）

### 核心文件统计
- **绝对核心**: 约20个文件（app + 首页 + 组件 + 数据）
- **重要功能**: 约30个文件
- **可选功能**: 约40个文件

### 瘦身潜力
- **删除未使用工具**: 减少5个文件
- **移除娱乐功能**: 减少约30个文件
- **分包优化**: 主包体积减少50%+

---

**生成时间**: 2024-11-20
**分析工具**: Kiro AI Assistant
