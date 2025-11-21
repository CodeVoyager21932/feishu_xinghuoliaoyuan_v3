# 创建占位图片说明

## 缺失的图片

当前小程序缺失以下两个关键图片：

### 1. `/miniprogram/images/empty-state.png`
- **用途**: 空状态提示图标
- **使用位置**: 英雄长廊等页面的空状态显示
- **建议**: 400x400px，透明背景，灰色简约图标

### 2. `/miniprogram/images/xinghuo-avatar.png`
- **用途**: AI讲解员"星火同志"的头像
- **使用位置**: AI对话页面
- **建议**: 200x200px，红色主题，可以是五角星或火炬图案

## 快速解决方案

### 方案 1: 使用在线工具创建

1. **访问 Canva** (https://www.canva.com)
   - 创建 400x400px 画布
   - 搜索 "empty box" 或 "empty state" 图标
   - 导出为 PNG

2. **访问 Figma** (https://www.figma.com)
   - 创建新文件
   - 使用形状工具绘制简单图标
   - 导出为 PNG

### 方案 2: 使用 emoji 作为临时方案

我已经在代码中使用了 emoji 作为临时显示：
- 空状态: 📦 (盒子)
- AI头像: 可以使用现有的默认头像

### 方案 3: 下载免费图标

推荐网站：
- **Iconfinder** (https://www.iconfinder.com)
- **Flaticon** (https://www.flaticon.com)
- **Icons8** (https://icons8.com)

搜索关键词：
- empty state
- empty box
- no data
- star icon (for xinghuo)
- torch icon

## 临时修复

如果你现在就想运行小程序，可以：

1. **复制现有图片作为占位**
```bash
cd miniprogram/images
copy default-avatar.png empty-state.png
copy default-avatar.png xinghuo-avatar.png
```

2. **或者修改代码使用 emoji**（已在部分页面实现）

## 推荐的图片内容

### empty-state.png 设计建议
```
┌─────────────────┐
│                 │
│      📦         │  ← 简约的空盒子
│                 │
│   暂无数据      │  ← 可选文字
│                 │
└─────────────────┘
```

### xinghuo-avatar.png 设计建议
```
┌─────────────────┐
│   ╱╲            │
│  ╱  ╲           │  ← 红色五角星
│ ╱ ★  ╲          │     或火炬图案
│╱______╲         │
│                 │
│  星火同志        │  ← 可选文字
└─────────────────┘
```

## 需要帮助？

如果你需要我帮你创建这些图片，请：
1. 告诉我你想要什么风格（简约/复古/现代）
2. 提供任何参考图片
3. 我可以提供 SVG 代码或推荐具体的图标资源
