# 小程序图片添加指南

## 📁 图片目录结构

```
miniprogram/images/
├── icons/              # 功能图标 (已完整)
│   ├── ai_chat.png
│   ├── biography.png
│   ├── flashcards.png
│   ├── hero_gallery.png
│   ├── knowledge_graph.png
│   ├── medal.png
│   ├── museum.png
│   ├── mystery_box.png
│   ├── pk_battle.png
│   ├── quote.png
│   └── radio.png
├── heroes/             # 英雄头像 (已有6个)
│   ├── huangjigu.png
│   ├── jiaoyulu.png
│   ├── leifeng.png
│   ├── lengyun.png
│   ├── qiujiahe.png
│   └── zhaoyiman.png
├── decorations/        # 装饰元素
│   └── ink-stroke.svg
├── default-avatar.png  # 默认头像 (已存在)
├── empty-state.png     # 空状态图标 (缺失 ⚠️)
└── xinghuo-avatar.png  # AI头像 (缺失 ⚠️)
```

## 🔴 缺失的关键图片

### 1. empty-state.png
- **用途**: 空状态提示图标
- **使用位置**: hero-gallery 等页面
- **建议尺寸**: 400x400px
- **建议内容**: 简约的空盒子或搜索图标

### 2. xinghuo-avatar.png
- **用途**: AI讲解员头像
- **使用位置**: ai-chat 页面
- **建议尺寸**: 200x200px
- **建议内容**: 星火主题的AI形象（如红星、火炬等）

## 📝 如何添加图片

### 方法一：通过文件管理器（推荐）

1. 在 Windows 文件管理器中打开项目目录
2. 导航到 `miniprogram/images/` 文件夹
3. 直接拖拽或复制图片文件到对应目录
4. 确保文件名与代码中引用的名称一致

### 方法二：通过微信开发者工具

1. 打开微信开发者工具
2. 在左侧文件树中右键点击 `images` 文件夹
3. 选择"在文件管理器中显示"
4. 将图片文件复制到该目录

### 方法三：通过命令行

```bash
# 进入 images 目录
cd miniprogram/images

# 复制图片文件
copy "你的图片路径\empty-state.png" .
copy "你的图片路径\xinghuo-avatar.png" .
```

## 🎨 图片规范建议

### 文件格式
- **PNG**: 推荐用于图标、透明背景图片
- **JPG**: 推荐用于照片、背景图
- **SVG**: 推荐用于矢量图标（需要注意兼容性）

### 尺寸建议
- **功能图标**: 128x128px 或 256x256px
- **英雄头像**: 400x500px（竖版）
- **背景图**: 750x1334px（按小程序设计稿宽度）
- **空状态图标**: 400x400px

### 文件大小
- 单个图片建议不超过 500KB
- 总图片资源建议不超过 2MB（小程序包大小限制）

### 命名规范
- 使用小写字母和连字符：`hero-avatar.png`
- 避免使用中文和特殊字符
- 使用有意义的描述性名称

## 🖼️ 临时解决方案

如果暂时没有合适的图片，可以：

### 1. 使用占位图服务
```javascript
// 在代码中使用占位图
src="https://via.placeholder.com/400x400/D32F2F/FFFFFF?text=Empty"
```

### 2. 使用 emoji 或文字
```xml
<!-- 在 WXML 中使用 emoji -->
<view class="empty-icon">📦</view>
```

### 3. 创建简单的 SVG
```xml
<!-- 内联 SVG -->
<view class="empty-icon">
  <svg width="100" height="100">
    <circle cx="50" cy="50" r="40" fill="#D32F2F"/>
  </svg>
</view>
```

## 🔧 快速创建缺失图片

### empty-state.png
可以使用以下工具快速创建：
- **在线工具**: Canva, Figma, Photopea
- **本地工具**: Photoshop, GIMP, Paint.NET
- **建议内容**: 
  - 简约的空盒子图标
  - 灰色调，透明背景
  - 圆角矩形风格

### xinghuo-avatar.png
建议设计元素：
- 红色五角星 ⭐
- 火炬图案 🔥
- 或者使用红色渐变圆形背景 + "星火"文字

## 📋 检查清单

添加图片后，请检查：
- [ ] 文件名与代码引用一致
- [ ] 图片格式正确（PNG/JPG）
- [ ] 文件大小合理（< 500KB）
- [ ] 图片清晰度足够
- [ ] 在小程序中测试显示效果

## 🚀 快速修复命令

如果你想快速创建占位图片，可以运行：

```bash
# 进入 images 目录
cd miniprogram/images

# 创建占位文件（Windows）
echo. > empty-state.png
echo. > xinghuo-avatar.png
```

然后用图片编辑工具打开这些文件，添加实际内容。

## 💡 提示

- 图片添加后需要重新编译小程序才能看到效果
- 建议使用 2x 或 3x 分辨率的图片以适配高清屏幕
- 可以使用图片压缩工具（如 TinyPNG）减小文件大小
- 考虑使用云存储（如微信云开发）存储大量图片资源
