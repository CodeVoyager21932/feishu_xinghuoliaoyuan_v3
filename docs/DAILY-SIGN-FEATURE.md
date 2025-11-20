# 每日签到（日签）功能开发文档

## 功能概述
"每日签到/日签"是一个国潮风格的打卡功能，用户每天可以生成一张精美的红色主题海报，包含每日名言、用户信息和小程序码，可保存到相册或分享给好友。

## 技术架构

### 1. 数据层
- **云数据库集合**: `daily_quotes`
- **字段结构**:
  - `date`: 日期（YYYY-MM-DD）
  - `image_url`: 背景图URL
  - `quote_content`: 名言内容
  - `author`: 出处/作者
  - `lucky_tips`: 今日宜/忌

### 2. 云函数
- **函数名**: `get-daily-quote`
- **功能**: 获取当天的名言数据，如果没有则返回随机或默认数据
- **位置**: `cloud/functions/get-daily-quote/`

### 3. 前端组件
- **组件名**: `daily-sign-modal`
- **位置**: `miniprogram/components/daily-sign-modal/`
- **文件**:
  - `daily-sign-modal.wxml` - 模板
  - `daily-sign-modal.wxss` - 样式
  - `daily-sign-modal.js` - 逻辑
  - `daily-sign-modal.json` - 配置

### 4. 数据文件
- **本地数据**: `miniprogram/data/daily-quotes.js`
- **用途**: 离线数据备份，云函数失败时使用

## 功能流程

### 用户操作流程
1. 用户点击首页右上角"📅 日签"按钮
2. 弹出全屏模态框，显示今日海报预览
3. 用户可以选择：
   - 点击"保存到相册"：生成海报并保存
   - 点击"分享给好友"：显示分享提示
   - 点击关闭按钮或遮罩层：关闭弹窗

### 海报生成流程
1. 使用 Canvas 2D API 绘制海报
2. 绘制顺序：
   - 背景图片
   - 半透明渐变蒙层
   - 右上角日期印章（红色圆形）
   - 竖排诗词（从右到左）
   - 作者署名（小字）
   - 底部用户信息（昵称 + 头像）
   - 小程序码（可选）
3. 导出为临时图片路径
4. 保存到相册或用于分享

## 视觉设计规范

### 海报尺寸
- **宽度**: 750rpx (375px)
- **高度**: 1334rpx (667px)
- **比例**: 9:16 竖版

### 色彩方案
- **主色**: 红色 (#D32F2F)
- **辅色**: 金色 (#C5A065)
- **背景**: 历史照片 + 半透明蒙层
- **文字**: 白色 (#FFFFFF)

### 字体规范
- **诗词**: 36px 宋体（Songti SC）
- **作者**: 24px 无衬线
- **用户名**: 28px 无衬线
- **日期**: 24px/48px 粗体

### 布局规范
- **日期印章**: 右上角，120rpx 圆形
- **诗词区域**: 右侧，竖排，从右到左
- **用户信息**: 底部居中，距底 200rpx

## 核心代码说明

### Canvas 2D 绘制
```javascript
// 获取 Canvas 节点
const query = wx.createSelectorQuery().in(this);
query.select('#posterCanvas')
  .fields({ node: true, size: true })
  .exec((res) => {
    const canvas = res[0].node;
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸（考虑设备像素比）
    const dpr = wx.getSystemInfoSync().pixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    // 开始绘制...
  });
```

### 竖排文字绘制
```javascript
// 将文字逐个字符竖向绘制
[...text].forEach((char, index) => {
  const y = startY + index * lineHeight;
  ctx.fillText(char, x, y);
});
```

### 保存到相册
```javascript
// 请求授权
await wx.authorize({ scope: 'scope.writePhotosAlbum' });

// 保存图片
await wx.saveImageToPhotosAlbum({
  filePath: posterPath
});
```

## 部署步骤

### 1. 初始化云数据库
参考 `cloud/database/daily_quotes_init.md` 文档创建集合和导入数据。

### 2. 部署云函数
```bash
# 在微信开发者工具中
# 右键点击 cloud/functions/get-daily-quote
# 选择"上传并部署：云端安装依赖"
```

### 3. 准备图片资源
- 将背景图片上传到 `miniprogram/images/daily-sign-bg/` 目录
- 或上传到云存储，更新数据库中的 `image_url` 字段

### 4. 测试功能
1. 在首页点击"日签"按钮
2. 检查海报是否正常显示
3. 测试保存到相册功能
4. 测试打卡记录是否正确

## 性能优化建议

### 1. 图片优化
- 背景图压缩到 200KB 以内
- 使用 WebP 格式（如果支持）
- 使用 CDN 加速

### 2. Canvas 优化
- 首次生成后缓存海报路径
- 避免重复绘制
- 使用离屏 Canvas（如果需要）

### 3. 数据缓存
- 缓存今日名言数据（24小时）
- 使用 `wx.setStorageSync` 存储

## 扩展功能建议

### 1. 多套模板
- 提供不同风格的海报模板
- 用户可以选择喜欢的样式

### 2. 个性化定制
- 允许用户选择背景图
- 自定义文字颜色

### 3. 社交功能
- 查看好友的日签
- 日签排行榜
- 连续打卡奖励

### 4. 数据统计
- 记录用户打卡历史
- 生成月度/年度报告
- 成就徽章系统

## 常见问题

### Q1: Canvas 绘制的图片模糊？
A: 需要考虑设备像素比（DPR），将 Canvas 尺寸乘以 DPR。

### Q2: 保存图片提示"用户拒绝授权"？
A: 引导用户打开设置页面授权：`wx.openSetting()`

### Q3: 背景图片加载失败？
A: 使用 `image.onerror` 捕获错误，提供默认背景。

### Q4: 竖排文字显示不正确？
A: 确保使用支持中文的字体，逐字符绘制。

## 相关文件清单

```
miniprogram/
├── components/
│   └── daily-sign-modal/          # 日签组件
│       ├── daily-sign-modal.wxml
│       ├── daily-sign-modal.wxss
│       ├── daily-sign-modal.js
│       └── daily-sign-modal.json
├── data/
│   └── daily-quotes.js            # 本地名言数据
├── images/
│   └── daily-sign-bg/             # 背景图片目录
│       └── README.md
└── pages/
    └── index/                     # 首页（集成日签入口）
        ├── index.wxml
        ├── index.wxss
        ├── index.js
        └── index.json

cloud/
├── functions/
│   └── get-daily-quote/           # 获取名言云函数
│       ├── index.js
│       ├── package.json
│       └── config.json
└── database/
    └── daily_quotes_init.md       # 数据库初始化文档

docs/
└── DAILY-SIGN-FEATURE.md          # 本文档
```

## 更新日志

### v1.0.0 (2025-11-20)
- ✅ 完成基础功能开发
- ✅ 实现 Canvas 海报生成
- ✅ 集成保存到相册功能
- ✅ 创建云函数和数据库结构
- ✅ 编写完整文档

---

**开发者**: Kiro AI Assistant  
**最后更新**: 2025-11-20
