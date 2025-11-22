# 图片加载工具使用指南

## 快速开始

### 1. 在 JS 中引入工具
```javascript
const { resolveImage, handleImageError } = require('../../utils/image-loader.js');
```

### 2. 在 WXML 中使用
```xml
<!-- 本地图片 -->
<image src="{{heroAvatar}}" binderror="onImageError" />

<!-- 云存储图片 -->
<image src="{{cloudImage}}" binderror="onImageError" />

<!-- 空状态兜底 -->
<image src="{{emptyState}}" />
```

### 3. 在 JS 中处理
```javascript
Page({
  data: {
    heroAvatar: '',
    cloudImage: '',
    emptyState: ''
  },

  onLoad() {
    this.setData({
      // 本地图片（如果路径为空，自动返回 HERO_AVATAR_SVG）
      heroAvatar: resolveImage('heroes/leifeng.png', 'local'),
      
      // 云存储图片
      cloudImage: resolveImage('banners/hero-banner.jpg', 'cloud'),
      
      // 空状态图标
      emptyState: resolveImage('', 'empty')
    });
  },

  // 图片加载失败兜底
  onImageError(e) {
    handleImageError(e, 'hero'); // 使用英雄默认头像兜底
  }
});
```

## API 文档

### resolveImage(path, type)
解析图片路径，返回完整 URL 或 Base64。

**参数**：
- `path` (string): 图片路径
- `type` (string): 图片类型
  - `'local'`: 本地图片（默认）
  - `'cloud'`: 云存储图片
  - `'avatar'`: AI 讲解员头像
  - `'hero'`: 英雄头像
  - `'card'`: 卡片封面

**返回值**：
- 完整的图片 URL 或 SVG Base64 字符串

**示例**：
```javascript
resolveImage('hero.png', 'local')  // => '/images/hero.png'
resolveImage('banner.jpg', 'cloud') // => 'cloud://env-id/assets/banner.jpg'
resolveImage('', 'avatar')          // => 'data:image/svg+xml;base64,...'
```

### handleImageError(e, fallbackType)
图片加载失败时的兜底处理。

**参数**：
- `e` (Event): 图片加载错误事件
- `fallbackType` (string): 兜底类型
  - `'avatar'`: AI 讲解员头像
  - `'hero'`: 英雄头像
  - `'card'`: 卡片封面
  - `'empty'`: 空状态图标（默认）

**示例**：
```javascript
onImageError(e) {
  handleImageError(e, 'hero');
}
```

## 实战案例

### 案例 1: 英雄列表页
```javascript
// pages/hero-gallery/index.js
const { resolveImage } = require('../../utils/image-loader.js');

Page({
  data: {
    heroes: []
  },

  onLoad() {
    const heroes = require('../../data/heroes.js');
    
    // 处理所有英雄头像
    const processedHeroes = heroes.map(hero => ({
      ...hero,
      avatar: resolveImage(hero.avatar || '', 'hero')
    }));

    this.setData({ heroes: processedHeroes });
  }
});
```

### 案例 2: AI 对话页
```javascript
// pages/ai-chat/index.js
const { resolveImage, AVATAR_SVG } = require('../../utils/image-loader.js');

Page({
  data: {
    aiAvatar: AVATAR_SVG, // 直接使用 SVG 常量
    messages: []
  },

  onLoad() {
    // AI 头像始终使用 SVG，零网络请求
    this.setData({
      aiAvatar: resolveImage('', 'avatar')
    });
  }
});
```

### 案例 3: 卡片学习页
```javascript
// pages/card-learning/index.js
const { resolveImage, handleImageError } = require('../../utils/image-loader.js');

Page({
  data: {
    cards: []
  },

  onLoad() {
    const cards = require('../../data/cards.js');
    
    const processedCards = cards.map(card => ({
      ...card,
      // 优先使用云存储图片，失败则兜底到 SVG
      cover: resolveImage(card.cover || '', 'card')
    }));

    this.setData({ cards: processedCards });
  },

  // 统一的图片错误处理
  onCardImageError(e) {
    handleImageError(e, 'card');
  }
});
```

## 最佳实践

### ✅ 推荐做法
1. **统一使用工具函数**：所有图片路径都通过 `resolveImage()` 处理
2. **添加错误处理**：所有 `<image>` 标签都绑定 `binderror` 事件
3. **优先使用 SVG**：对于图标类资源，直接使用 SVG 常量
4. **延迟加载云图片**：非首屏图片使用 `lazy-load` 属性

### ❌ 避免做法
1. **硬编码路径**：不要直接写 `/images/xxx.png`
2. **忽略错误**：不要省略 `binderror` 处理
3. **滥用云存储**：小图标应使用 SVG，不要上传到云端
4. **缺少兜底**：确保所有图片都有失败兜底方案

## 体积优化建议

### SVG vs 位图选择
- **使用 SVG**：图标、Logo、简单图形（< 5KB）
- **使用位图**：照片、复杂插画（> 10KB）

### 云存储迁移优先级
1. **高优先级**（立即迁移）：
   - 英雄头像（30 张 × 50KB = 1.5MB）
   - 卡片封面（20 张 × 100KB = 2MB）
   - Banner 图（5 张 × 200KB = 1MB）

2. **中优先级**（按需迁移）：
   - 成就徽章（8 张 × 20KB = 160KB）
   - 背景图（3 张 × 150KB = 450KB）

3. **低优先级**（保留本地）：
   - 小图标（< 5KB）
   - 装饰性元素（< 10KB）

## 故障排查

### 问题 1: 图片显示为空
**原因**：路径错误或云存储未配置
**解决**：检查 `app.js` 中的 `cloudImageBase` 是否正确

### 问题 2: SVG 显示异常
**原因**：Base64 编码错误
**解决**：使用 `assets.js` 中预定义的 SVG 常量

### 问题 3: 云图片加载慢
**原因**：弱网环境或图片过大
**解决**：添加 Loading 占位符，使用 CDN 加速
